/**
 * zlibrev.ts の for文内 var 宣言を let に変換するスクリプト
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'zlibrev.ts');

// ファイルを読み込む
let content = fs.readFileSync(filePath, 'utf-8');

// 変換前の数
const beforeCount = (content.match(/for\s*\(\s*var\s+/g) || []).length;

// for(var を for(let に変換
content = content.replace(/for\s*\(\s*var\s+/g, 'for(let ');

// while内や他のコンテキストでの var も変換
content = content.replace(/\}\s*while\s*\(\s*var\s+/g, '} while(let ');

// ファイルに書き込む
fs.writeFileSync(filePath, content, 'utf-8');

// 変換後の数
const afterCount = (content.match(/for\s*\(\s*var\s+/g) || []).length;

console.log(`\nfor文内のvar宣言を変換しました:`);
console.log(`  変換前: ${beforeCount} 箇所`);
console.log(`  変換後: ${afterCount} 箇所`);
console.log(`  変換数: ${beforeCount - afterCount} 箇所`);

// 最終統計
console.log(`\n最終統計:`);
console.log(`  const: ${(content.match(/^\s*const\s+/gm) || []).length}`);
console.log(`  let: ${(content.match(/^\s*let\s+/gm) || []).length}`);
console.log(`  for(let: ${(content.match(/for\s*\(\s*let\s+/g) || []).length}`);
console.log(`  var (残り): ${(content.match(/\bvar\s+/g) || []).length}`);
