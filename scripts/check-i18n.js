import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.resolve(__dirname, '../src');

function getAllTsxFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllTsxFiles(fullPath));
    } else if (file.endsWith('.tsx')) {
      results.push(fullPath);
    }
  });
  return results;
}

const files = getAllTsxFiles(srcDir);
let issuesFound = 0;

console.log(`[i18n Safeguard Linter] Auditing ${files.length} JSX/TSX files in src/ for untranslated literal JSX text...`);

files.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  lines.forEach((line, index) => {
    // Check for hardcoded JSX text patterns like >Some English Text< where text isn't empty, brackets, numbers, or symbols
    const match = line.match(/>\s*([A-Za-z]{3,}[A-Za-z0-9\s,':\-\?\.\(\)]*)\s*</);
    if (match) {
      const text = match[1].trim();
      // Ignore known code tags, imports, or SVG paths
      if (!text.includes('className') && !text.includes('http') && !text.includes('import') && !text.includes('export')) {
        // Flag if string does not use t()
        if (!line.includes('{t(') && !line.includes('{i18n') && !line.includes('t(')) {
          console.warn(`  ⚠️ [Potential Untranslated String] ${path.relative(srcDir, filePath)}:${index + 1} -> "${text}"`);
          issuesFound++;
        }
      }
    }
  });
});

if (issuesFound === 0) {
  console.log(`✅ [i18n Safeguard Linter] 0 untranslated JSX text strings found across all components!`);
} else {
  console.log(`ℹ️ [i18n Safeguard Linter] Found ${issuesFound} potential untranslated text occurrences for review.`);
}
