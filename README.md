# Sutra

A tiny Sanskrit-style joke language that compiles to JavaScript.

## Example

```sutra
मान x = 3

यावत् (x > 0) {
  मुद्रय("नमस्ते")
  x = x - 1
}
```

This compiles to:

```javascript
let x = 3;

while (x > 0) {
  console.log("नमस्ते");
  x = x - 1;
}
```

## Installation

```bash
npm install -g sutra
```

## Usage

```bash
sutra run hello.skt
```

## Disclaimer

This is a joke language. It's not for production use. It's made for fun and to learn how compilers work.

## Playground

The website is a Next.js React app with Chakra UI.

```bash
cd website
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Keywords

- `मान` → `let`
- `मुद्रय` → `console.log`
- `यावत्` → `while`

That's it. No if, no functions, no imports. Just the basics.

