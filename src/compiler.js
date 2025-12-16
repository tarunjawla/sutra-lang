function compile(sutraCode) {
  let code = sutraCode;

  const hasAarambh = /आरम्भ/.test(code);
  const hasSamapt = /समाप्त/.test(code);

  if (hasAarambh && !hasSamapt) {
    throw new Error('समाप्त found without आरम्भ');
  }
  if (!hasAarambh && hasSamapt) {
    throw new Error('आरम्भ found without समाप्त');
  }

  if (hasAarambh && hasSamapt) {
    const match = code.match(/आरम्भ\s*([\s\S]*?)\s*समाप्त/);
    if (!match) {
      throw new Error('Invalid program boundaries');
    }
    code = match[1];
  }

  code = code.replace(/\/\/.*$/gm, '');

  code = code.replace(/मान\s+/g, 'let ');
  code = code.replace(/मुद्रय\s*\(/g, 'console.log(');
  code = code.replace(/यावत्\s*\(/g, 'while (');
  code = code.replace(/यदि\s*\(/g, 'if (');
  code = code.replace(/अन्यथा\s*\{/g, 'else {');
  code = code.replace(/असत्य/g, 'false');
  code = code.replace(/सत्य/g, 'true');
  code = code.replace(/शून्य/g, 'null');
  code = code.replace(/विराम/g, 'break');
  code = code.replace(/अग्रिम/g, 'continue');

  const openBraces = (code.match(/\{/g) || []).length;
  const closeBraces = (code.match(/\}/g) || []).length;

  if (openBraces !== closeBraces) {
    throw new Error('Unmatched curly braces');
  }

  return code;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { compile };
}
