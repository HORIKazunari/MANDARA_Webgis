#!/usr/bin/env node

const path = require('node:path');
const ts = require('typescript');

const projectRoot = process.cwd();
const srcRoot = path.join(projectRoot, 'src');
const ambientFilePath = path.join(srcRoot, 'globals.d.ts');

function normalize(filePath) {
    return path.resolve(filePath);
}

function fail(message) {
    console.error(message);
    process.exit(1);
}

function formatLocation(sourceFile, position) {
    const { line, character } = ts.getLineAndCharacterOfPosition(sourceFile, position);
    return `${path.relative(projectRoot, sourceFile.fileName)}:${line + 1}:${character + 1}`;
}

function hasModifier(node, kind) {
    return node.modifiers?.some(modifier => modifier.kind === kind) ?? false;
}

function collectAmbientRuntimeDeclarations(sourceFile) {
    const declarations = new Map();

    for (const statement of sourceFile.statements) {
        if (ts.isVariableStatement(statement) && hasModifier(statement, ts.SyntaxKind.DeclareKeyword)) {
            for (const declaration of statement.declarationList.declarations) {
                if (ts.isIdentifier(declaration.name)) {
                    declarations.set(declaration.name.text, {
                        kind: 'variable',
                        location: formatLocation(sourceFile, declaration.name.getStart())
                    });
                }
            }
            continue;
        }

        if (ts.isFunctionDeclaration(statement) && statement.name && hasModifier(statement, ts.SyntaxKind.DeclareKeyword)) {
            declarations.set(statement.name.text, {
                kind: 'function',
                location: formatLocation(sourceFile, statement.name.getStart())
            });
            continue;
        }

        if (ts.isClassDeclaration(statement) && statement.name && hasModifier(statement, ts.SyntaxKind.DeclareKeyword)) {
            declarations.set(statement.name.text, {
                kind: 'class',
                location: formatLocation(sourceFile, statement.name.getStart())
            });
            continue;
        }

        if (ts.isEnumDeclaration(statement) && hasModifier(statement, ts.SyntaxKind.DeclareKeyword)) {
            declarations.set(statement.name.text, {
                kind: 'enum',
                location: formatLocation(sourceFile, statement.name.getStart())
            });
        }
    }

    return declarations;
}

function collectProjectExports(program) {
    const exportsByName = new Map();

    function addExport(name, fileName) {
        const relativeFileName = path.relative(projectRoot, fileName);
        const files = exportsByName.get(name) ?? new Set();
        files.add(relativeFileName);
        exportsByName.set(name, files);
    }

    for (const sourceFile of program.getSourceFiles()) {
        const normalizedFileName = normalize(sourceFile.fileName);
        if (sourceFile.isDeclarationFile || normalizedFileName === normalize(ambientFilePath) || !normalizedFileName.startsWith(normalize(srcRoot))) {
            continue;
        }

        for (const statement of sourceFile.statements) {
            if ((ts.isClassDeclaration(statement) || ts.isFunctionDeclaration(statement) || ts.isInterfaceDeclaration(statement) || ts.isEnumDeclaration(statement) || ts.isTypeAliasDeclaration(statement)) && statement.name && hasModifier(statement, ts.SyntaxKind.ExportKeyword)) {
                addExport(statement.name.text, sourceFile.fileName);
                continue;
            }

            if (ts.isVariableStatement(statement) && hasModifier(statement, ts.SyntaxKind.ExportKeyword)) {
                for (const declaration of statement.declarationList.declarations) {
                    if (ts.isIdentifier(declaration.name)) {
                        addExport(declaration.name.text, sourceFile.fileName);
                    }
                }
                continue;
            }

            if (ts.isExportDeclaration(statement) && statement.exportClause && ts.isNamedExports(statement.exportClause) && !statement.moduleSpecifier) {
                for (const element of statement.exportClause.elements) {
                    addExport(element.name.text, sourceFile.fileName);
                }
            }
        }
    }

    return exportsByName;
}

function isRuntimeReference(node) {
    if (!ts.isExpressionNode(node) || !ts.isInExpressionContext(node)) {
        return false;
    }

    const parent = node.parent;
    if (!parent) {
        return false;
    }

    if (ts.isPropertyAccessExpression(parent) && parent.name === node) {
        return false;
    }

    if (ts.isPropertyAssignment(parent) && parent.name === node) {
        return false;
    }

    if (ts.isQualifiedName(parent) || ts.isTypeQueryNode(parent) || ts.isImportTypeNode(parent)) {
        return false;
    }

    return true;
}

function resolveSymbol(checker, node) {
    const symbol = checker.getSymbolAtLocation(node);
    if (!symbol) {
        return undefined;
    }
    return (symbol.flags & ts.SymbolFlags.Alias) !== 0 ? checker.getAliasedSymbol(symbol) : symbol;
}

function hasTsNoCheck(sourceFile) {
    return sourceFile.text.split(/\r?\n/, 3).some(line => line.includes('@ts-nocheck'));
}

const tsconfigPath = ts.findConfigFile(projectRoot, ts.sys.fileExists, 'tsconfig.json');
if (!tsconfigPath) {
    fail('tsconfig.json が見つかりません。');
}

const configFile = ts.readConfigFile(tsconfigPath, ts.sys.readFile);
if (configFile.error) {
    fail(ts.formatDiagnosticsWithColorAndContext([configFile.error], {
        getCanonicalFileName: fileName => fileName,
        getCurrentDirectory: () => projectRoot,
        getNewLine: () => '\n'
    }));
}

const parsedConfig = ts.parseJsonConfigFileContent(configFile.config, ts.sys, projectRoot);
if (parsedConfig.errors.length > 0) {
    fail(ts.formatDiagnosticsWithColorAndContext(parsedConfig.errors, {
        getCanonicalFileName: fileName => fileName,
        getCurrentDirectory: () => projectRoot,
        getNewLine: () => '\n'
    }));
}

const program = ts.createProgram({
    rootNames: parsedConfig.fileNames,
    options: parsedConfig.options
});
const checker = program.getTypeChecker();
const rootFileNames = new Set(parsedConfig.fileNames.map(normalize));
const ambientSourceFile = program.getSourceFiles().find(sourceFile => normalize(sourceFile.fileName) === normalize(ambientFilePath));

if (!ambientSourceFile) {
    fail('src/globals.d.ts が Program に含まれていません。');
}

const ambientDeclarations = collectAmbientRuntimeDeclarations(ambientSourceFile);
const exportedSymbols = collectProjectExports(program);
const findings = [];

for (const sourceFile of program.getSourceFiles()) {
    const normalizedFileName = normalize(sourceFile.fileName);
    if (
        sourceFile.isDeclarationFile ||
        normalizedFileName === normalize(ambientFilePath) ||
        !normalizedFileName.startsWith(normalize(srcRoot)) ||
        !rootFileNames.has(normalizedFileName) ||
        hasTsNoCheck(sourceFile)
    ) {
        continue;
    }

    const seenLocations = new Set();

    const visit = node => {
        if (ts.isIdentifier(node) && ambientDeclarations.has(node.text) && isRuntimeReference(node)) {
            const symbol = resolveSymbol(checker, node);
            const declarations = symbol?.declarations ?? [];
            const isAmbientReference = declarations.some(declaration => normalize(declaration.getSourceFile().fileName) === normalize(ambientFilePath));

            if (isAmbientReference) {
                const location = formatLocation(sourceFile, node.getStart());
                if (!seenLocations.has(location)) {
                    seenLocations.add(location);
                    findings.push({
                        name: node.text,
                        location,
                        ambient: ambientDeclarations.get(node.text),
                        exportedFrom: [...(exportedSymbols.get(node.text) ?? [])].filter(fileName => fileName !== path.relative(projectRoot, sourceFile.fileName))
                    });
                }
            }
        }

        ts.forEachChild(node, visit);
    };

    ts.forEachChild(sourceFile, visit);
}

if (findings.length === 0) {
    console.log('No ambient runtime dependency risks found.');
    process.exit(0);
}

console.error(`Found ${findings.length} ambient runtime dependency risk(s):`);
for (const finding of findings) {
    console.error(`- ${finding.location} uses ambient ${finding.ambient.kind} ${finding.name} declared at ${finding.ambient.location}`);
    if (finding.exportedFrom.length > 0) {
        console.error(`  import candidate: ${finding.exportedFrom.join(', ')}`);
    } else {
        console.error('  import candidate: none in src exports; this may need AppState or another explicit runtime source');
    }
}

process.exit(1);