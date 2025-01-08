import JavaScriptObfuscator from 'javascript-obfuscator';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create dist directory if it doesn't exist
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist', { recursive: true });
  fs.mkdirSync('dist/lib', { recursive: true });
}

// Files to obfuscate
const files = [
  ['index.js', 'dist/index.js'],
  ['lib/config.js', 'dist/lib/config.js'],
  ['lib/auth.js', 'dist/lib/auth.js'],
  ['lib/api-service.js', 'dist/lib/api-service.js'],
  ['lib/error-handler.js', 'dist/lib/error-handler.js']
];

// Obfuscation configuration
const config = {
  compact: true,
  controlFlowFlattening: false,
  deadCodeInjection: false,
  debugProtection: false,
  debugProtectionInterval: 2000,
  disableConsoleOutput: false,
  identifierNamesGenerator: 'hexadecimal',
  numbersToExpressions: true,
  simplify: true,
  splitStrings: false,
  stringArray: false,
  stringArrayEncoding: ['base64'],
  transformObjectKeys: true,
  unicodeEscapeSequence: false,
  selfDefending: false,
  target: 'node',
  sourceMap: false
};

// Process each file
files.forEach(([inputFile, outputFile]) => {
  const code = fs.readFileSync(inputFile, 'utf8');
  const result = JavaScriptObfuscator.obfuscate(code, config);
  fs.writeFileSync(outputFile, result.getObfuscatedCode());
});

// Copy package.json and modify it
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.scripts = {}; // Remove scripts for production
fs.writeFileSync('dist/package.json', JSON.stringify(pkg, null, 2));

console.log('Build completed successfully!');