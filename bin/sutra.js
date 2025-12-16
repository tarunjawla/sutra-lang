#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { compile } = require('../src/compiler.js');

const args = process.argv.slice(2);

if (args.length === 0 || args[0] !== 'run' || args.length < 2) {
  console.error('Usage: sutra run <file.skt>');
  process.exit(1);
}

const filePath = args[1];

if (!fs.existsSync(filePath)) {
  console.error(`Error: File "${filePath}" not found.`);
  process.exit(1);
}

if (!filePath.endsWith('.skt')) {
  console.error('Error: File must have .skt extension.');
  process.exit(1);
}

try {
  const sutraCode = fs.readFileSync(filePath, 'utf-8');
  const jsCode = compile(sutraCode);
  
  const context = {
    console: {
      log: (...args) => {
        console.log(...args);
      }
    }
  };
  
  vm.createContext(context);
  vm.runInContext(jsCode, context);
} catch (error) {
  if (error.message.includes('Unexpected')) {
    console.error('Error: Invalid Sutra syntax.');
  } else {
    console.error(`Error: ${error.message}`);
  }
  process.exit(1);
}

