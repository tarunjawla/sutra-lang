function getLineInfo(code, index) {
  let lineNumber = 1;
  let columnNumber = 1;

  for (let position = 0; position < index; position += 1) {
    const character = code.charAt(position);
    if (character === '\n') {
      lineNumber += 1;
      columnNumber = 1;
    } else {
      columnNumber += 1;
    }
  }

  const lines = code.split(/\r?\n/);
  const lineText = lines[lineNumber - 1] || '';

  return {
    lineNumber,
    columnNumber,
    lineText,
  };
}

function buildError(message, code, index) {
  const info = getLineInfo(code, index);
  const trimmedLine = info.lineText.trim();
  const snippet = trimmedLine.length > 60 ? `${trimmedLine.slice(0, 57)}...` : trimmedLine;

  return new Error(
    `${message} at line ${info.lineNumber}, column ${info.columnNumber} near "${snippet}"`
  );
}

function extractProgramBlock(sutraCode) {
  let code = sutraCode;

  const hasAarambh = /आरम्भ/.test(code);
  const hasSamapt = /समाप्त/.test(code);

  if (hasAarambh && !hasSamapt) {
    const index = code.indexOf('आरम्भ');
    throw buildError('समाप्त found without आरम्भ', code, index >= 0 ? index : 0);
  }

  if (!hasAarambh && hasSamapt) {
    const index = code.indexOf('समाप्त');
    throw buildError('आरम्भ found without समाप्त', code, index >= 0 ? index : 0);
  }

  if (hasAarambh && hasSamapt) {
    const match = code.match(/आरम्भ\s*([\s\S]*?)\s*समाप्त/);
    if (!match || typeof match[1] !== 'string') {
      const index = code.indexOf('आरम्भ');
      throw buildError('Invalid program boundaries', code, index >= 0 ? index : 0);
    }
    code = match[1];
  }

  return code;
}

function removeComments(code) {
  const lines = code.split(/\r?\n/);
  const cleanedLines = lines.map((line) => {
    let inSingleQuote = false;
    let inDoubleQuote = false;

    for (let index = 0; index < line.length - 1; index += 1) {
      const character = line.charAt(index);
      const nextCharacter = line.charAt(index + 1);

      if (character === '\\') {
        index += 1;
        continue;
      }

      if (!inDoubleQuote && character === '\'') {
        inSingleQuote = !inSingleQuote;
        continue;
      }

      if (!inSingleQuote && character === '"') {
        inDoubleQuote = !inDoubleQuote;
        continue;
      }

      if (!inSingleQuote && !inDoubleQuote && character === '/' && nextCharacter === '/') {
        return line.slice(0, index);
      }
    }

    return line;
  });

  return cleanedLines.join('\n');
}

function replaceKeywords(code) {
  let transformedCode = code;

  transformedCode = transformedCode.replace(/मान\s+/g, 'let ');
  transformedCode = transformedCode.replace(/मुद्रय\s*\(/g, 'console.log(');
  transformedCode = transformedCode.replace(/दर्शय\s*\(/g, 'console.log(');
  transformedCode = transformedCode.replace(/यावत्\s*\(/g, 'while (');

  transformedCode = transformedCode.replace(/यदि\s*\(/g, 'if (');
  transformedCode = transformedCode.replace(/अन्यथा\s*\{/g, 'else {');

  transformedCode = transformedCode.replace(/असत्य/g, 'false');
  transformedCode = transformedCode.replace(/सत्य/g, 'true');
  transformedCode = transformedCode.replace(/शून्य/g, 'null');

  transformedCode = transformedCode.replace(/विराम/g, 'break');
  transformedCode = transformedCode.replace(/अग्रिम/g, 'continue');

  return transformedCode;
}

function normalizeSemicolons(code) {
  const lines = code.split(/\r?\n/);

  const normalizedLines = lines.map((line) => {
    const trimmed = line.trim();

    if (trimmed === '') {
      return '';
    }

    if (trimmed.startsWith('//')) {
      return line;
    }

    const lastCharacter = trimmed.charAt(trimmed.length - 1);

    if (lastCharacter === '{' || lastCharacter === '}' || lastCharacter === ';') {
      return line;
    }

    return `${line};`;
  });

  return normalizedLines.join('\n');
}

function validateStructure(code) {
  const stack = [];

  for (let index = 0; index < code.length; index += 1) {
    const character = code.charAt(index);
    if (character === '{') {
      stack.push(index);
    } else if (character === '}') {
      if (stack.length === 0) {
        throw buildError('Unmatched closing brace', code, index);
      }
      stack.pop();
    }
  }

  if (stack.length > 0) {
    const index = stack[stack.length - 1];
    throw buildError('Unmatched opening brace', code, index);
  }
}

function validateSyntax(sutraCode) {
  const lines = sutraCode.split(/\r?\n/);

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const line = lines[lineIndex];

    if (line.indexOf('यदि') !== -1) {
      const hasValidShape = /यदि\s*\([^)]*\)\s*\{/.test(line);
      if (!hasValidShape) {
        const indexInLine = line.indexOf('यदि');
        const indexInCode = sutraCode.indexOf(line) + indexInLine;
        throw buildError('Invalid यदि block shape', sutraCode, indexInCode);
      }
    }

    if (line.indexOf('अन्यथा') !== -1) {
      if (/अन्यथा\s*\(/.test(line)) {
        const indexInLine = line.indexOf('अन्यथा');
        const indexInCode = sutraCode.indexOf(line) + indexInLine;
        throw buildError('अन्यथा cannot have a condition', sutraCode, indexInCode);
      }

      if (line.indexOf('{') === -1) {
        const indexInLine = line.indexOf('अन्यथा');
        const indexInCode = sutraCode.indexOf(line) + indexInLine;
        throw buildError('Invalid अन्यथा block shape', sutraCode, indexInCode);
      }
    }
  }
}

function validateLoopControl(sutraCode) {
  const lines = sutraCode.split(/\r?\n/);
  let loopDepth = 0;
  let offset = 0;

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const line = lines[lineIndex];
    const trimmed = line.trim();

    if (/यावत्\s*\([^)]*\)\s*\{/.test(trimmed)) {
      loopDepth += 1;
    }

    if (trimmed.indexOf('विराम') !== -1 || trimmed.indexOf('अग्रिम') !== -1) {
      if (loopDepth === 0) {
        const keywordIndex = trimmed.indexOf('विराम') !== -1
          ? line.indexOf('विराम')
          : line.indexOf('अग्रिम');
        const indexInCode = offset + (keywordIndex >= 0 ? keywordIndex : 0);
        throw buildError('Loop control keyword found outside of loop', sutraCode, indexInCode);
      }
    }

    for (let index = 0; index < line.length; index += 1) {
      const character = line.charAt(index);
      if (character === '}' && loopDepth > 0) {
        loopDepth -= 1;
      }
    }

    offset += line.length + 1;
  }
}

function compile(sutraCode) {
  const programBlock = extractProgramBlock(sutraCode);
  const withoutComments = removeComments(programBlock);

  const withNormalizedSemicolons = normalizeSemicolons(withoutComments);

  validateSyntax(withNormalizedSemicolons);
  validateStructure(withNormalizedSemicolons);
  validateLoopControl(withNormalizedSemicolons);

  const withKeywordsReplaced = replaceKeywords(withNormalizedSemicolons);

  return withKeywordsReplaced;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { compile };
}
