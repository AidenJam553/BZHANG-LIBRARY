/*
  Simple DOCX -> Markdown converter using mammoth
  Usage: node scripts/docx-to-md.js <input.docx> <output.md>
*/

import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';

async function convertDocxToMarkdown(inputPath, outputPath) {
  try {
    const absoluteInputPath = path.resolve(inputPath);
    const absoluteOutputPath = path.resolve(outputPath);

    const buffer = fs.readFileSync(absoluteInputPath);
    const { value: markdown } = await mammoth.convertToMarkdown({ buffer });

    fs.writeFileSync(absoluteOutputPath, markdown, 'utf8');
    console.log(`Converted to: ${absoluteOutputPath}`);
  } catch (error) {
    console.error('Conversion failed:', error.message);
    process.exit(1);
  }
}

const [,, inFile, outFile] = process.argv;
if (!inFile || !outFile) {
  console.error('Usage: node scripts/docx-to-md.js <input.docx> <output.md>');
  process.exit(1);
}

convertDocxToMarkdown(inFile, outFile);


