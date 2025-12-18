import Head from 'next/head'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import '@fontsource/noto-sans-devanagari/400.css'
import '@fontsource/noto-sans-devanagari/700.css'

const theme = extendTheme({
  fonts: {
    heading: 'Noto Sans Devanagari, serif',
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
    mono: 'Courier New, monospace',
    ancient: '"Times New Roman", "Noto Sans Devanagari", serif',
  },
  colors: {
    parchment: {
      50: '#faf9f6',
      100: '#f5f1e8',
      200: '#e8e0d0',
      300: '#d4c4a8',
      400: '#b8a080',
      500: '#9d7c58',
    },
    ancient: {
      saffron: '#FF9933',
      deepRed: '#8B0000',
      gold: '#DAA520',
      maroon: '#800000',
      terracotta: '#CD853F',
      deepPurple: '#4B0082',
    },
  },
  styles: {
    global: {
      body: {
        bg: '#f5f1e8',
        color: '#2c2c2c',
      },
      '*::placeholder': {
        color: 'gray.400',
      },
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'gray',
      },
    },
  },
})

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Head>
        <title>Sutra – A tiny Sanskrit-style joke language</title>
        <meta
          name="description"
          content="Sutra is a tiny Sanskrit-style joke language that compiles to JavaScript."
        />
        <link rel="icon" href="/sutra-favicon.svg" />
      </Head>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp

