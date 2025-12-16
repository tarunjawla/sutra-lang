function compile(sutraCode) {
  let jsCode = sutraCode;

  jsCode = jsCode.replace(/मान\s+/g, 'let ');
  jsCode = jsCode.replace(/मुद्रय\s*\(/g, 'console.log(');
  jsCode = jsCode.replace(/यावत्\s*\(/g, 'while (');

  return jsCode;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { compile };
}

