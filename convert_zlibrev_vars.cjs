/**
 * zlibrev.ts の var 宣言を const/let に変換するスクリプト
 * より正確な解析と変換を行います
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'zlibrev.ts');
const backupPath = filePath + '.backup';

// ファイルを読み込む
let content = fs.readFileSync(filePath, 'utf-8');
const lines = content.split('\n');

// 変換統計
const stats = {
  toConst: [],
  toLet: [],
  unchanged: []
};

// 再代入なし（const変換対象）の変数名パターン
const constVariableNames = [
  'COMPILED', 'USE_TYPEDARRAY', 'ZLIB_CRC32_COMPACT',
  'ZLIB_STREAM_RAW_INFLATE_BUFFER_SIZE', 'ZLIB_RAW_INFLATE_BUFFER_SIZE',
  'goog', 'buildHuffmanTable', 'listSize', 'lengths',
  'codeLengths', 'codeLengthsTable', 'litlenLengths',
  'distLengths', 'litLenLengths', 'distLengths', 'litlenTable',
  'distTable', 'lengthTable', 'lz77Array', 'codeArray',
  'windowSize', 'oldbuf', 'rawDeflateOption', 'deflator',
  'files', 'filenameList', 'blocks', 'stop', 'foundCaller',
  'adler32', 'litlen', 'bufferSize', 'bufferType',
  'localFileSize', 'centralDirectorySize', 'endOfCentralDirectorySize',
  'maxHuffCode', 'maxInflateSize',
];

// 再代入あり（let変換対象）の一般的な変数名
const letVariableNames = [
  // ループ変数
  'i', 'j', 'k', 'il', 'jl', 'l', 't', 'm', 'n',
  // 位置・ポインタ
  'pos', 'ip', 'op', 'op1', 'op2', 'op3', 'index', 'offset',
  // サイズ・長さ
  'length', 'len', 'nlen', 'size', 'olength', 'newSize', 'inflen',
  // カウント
  'count', 'ci',
  // ビット操作
  'bitsbuf', 'bitsbuflen', 'bitindex', 'bits', 'bitlen', 'bitLength',
  // コード関連
  'code', 'codeLength', 'codeWithLength', 'codeDist',
  // 値
  'value', 'octet', 'current', 'next', 'prev',
  // マッチング
  'match', 'matchKey', 'matchLength', 'matchMax', 'currentMatch',
  'longestMatch', 'prevMatch',
  // その他
  'skip', 'reversed', 'rtemp', 'repeat', 'rpt',
  'parent', 'swap', 'tmp', 'buffer', 'output', 'input',
  'crc', 'crc16', 'crc32', 'ratio', 'tlen',
  'str', 'c', 'x', 's', 'r', 'p', 's1', 's2',
  'flg', 'flags', 'hdr', 'hlit', 'hdist', 'hclen',
  'mtime', 'date', 'isize', 'plainSize',
  'table', 'startCode', 'ti',
  'compressionMethod', 'needVersion', 'key',
  'weight', 'excess', 'half',
  // goog関連
  'namespace', 'parts', 'part', 'cur', 'path', 'src',
  'provide', 'require',
  // ファイル関連
  'file', 'filename', 'filenameLength',
  'extraField', 'extraFieldLength',
  'comment', 'commentLength',
  // 追加の変数（第2ラウンド）
  'doc', 'type', 'scripts', 'newArgs', 'deps', 'args',
  'values', 'seenScript', 'scriptElt', 'renameByParts',
  'rename', 'qmark', 'mapped', 'importScript', 'global',
  'getMapping', 'errorMessage', 'clone', 'className',
  'caller', 'boundArgs', 'treeSymbols', 'litLenLengths',
  'distLengths', 'litLenCodes', 'distCodes', 'treeLengths',
  'transLengths', 'treeCodes', 'hclenOrder', 'dataArray',
  'litLen', 'dist', 'stream', 'literal', 'bfinal', 'btype',
  'blockArray', 'fileHeader', 'localFileHeader',
  'filelist', 'filetable', 'fileHeaderList',
  'data', 'rawinflate', 'rawdeflate', 'inflated',
  'compressed', 'block', 'nodes', 'codeTable',
  'maxCodeLength', 'minCodeLength', 'backward',
  'preCopy', 'inputLength', 'limit', 'position',
  'matchList', 'lz77buf', 'skipLength', 'freqsLitLen',
  'freqsDist', 'lazy', 'longestMatch', 'prevMatch',
  'prop', 'keys', 'nResult', 'runLength', 'freqs',
  'nSymbols', 'heap', 'minimumCost', 'flag', 'currentPosition',
  'codes', 'fdict', 'flevel', 'fcheck', 'adler',
  'error', 'cm', 'cinfo', 'cmf', 'clevel',
  'member', 'isize', 'inflen', 'mtime', 'password',
  'ubt', 'detected', 'text_decoder', 'buff', 'dv',
];

// 行ごとに処理
for (let lineNum = 0; lineNum < lines.length; lineNum++) {
  let line = lines[lineNum];
  const originalLine = line;
  
  // var 宣言を探す
  const varMatch = line.match(/^(\s*)var\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/);
  
  if (varMatch) {
    const indent = varMatch[1];
    const varName = varMatch[2];
    
    // const に変換すべきか判定
    if (constVariableNames.includes(varName)) {
      line = line.replace(/^(\s*)var\s+/, `${indent}const `);
      stats.toConst.push({ lineNum: lineNum + 1, varName, originalLine });
    }
    // let に変換すべきか判定
    else if (letVariableNames.includes(varName)) {
      line = line.replace(/^(\s*)var\s+/, `${indent}let `);
      stats.toLet.push({ lineNum: lineNum + 1, varName, originalLine });
    }
    
    lines[lineNum] = line;
  }
}

// 結果を書き込む
const newContent = lines.join('\n');

// バックアップが存在しない場合のみ作成
if (!fs.existsSync(backupPath)) {
  fs.writeFileSync(backupPath, content, 'utf-8');
  console.log(`バックアップを作成しました: ${backupPath}`);
}

fs.writeFileSync(filePath, newContent, 'utf-8');

// 統計を表示
console.log('\n変換完了！');
console.log(`\n変換統計:`);
console.log(`  const に変換: ${stats.toConst.length} 箇所`);
console.log(`  let に変換: ${stats.toLet.length} 箇所`);
console.log(`\n変換後の宣言数:`);
console.log(`  const: ${(newContent.match(/^\s*const\s+/gm) || []).length}`);
console.log(`  let: ${(newContent.match(/^\s*let\s+/gm) || []).length}`);
console.log(`  var (残り): ${(newContent.match(/^\s*var\s+/gm) || []).length}`);

// 変換された変数のサンプルを表示
if (stats.toConst.length > 0) {
  console.log(`\nconst に変換された変数の例（最初の10件）:`);
  stats.toConst.slice(0, 10).forEach(({ lineNum, varName }) => {
    console.log(`  Line ${lineNum}: ${varName}`);
  });
}

if (stats.toLet.length > 0) {
  console.log(`\nlet に変換された変数の例（最初の10件）:`);
  stats.toLet.slice(0, 10).forEach(({ lineNum, varName }) => {
    console.log(`  Line ${lineNum}: ${varName}`);
  });
}
