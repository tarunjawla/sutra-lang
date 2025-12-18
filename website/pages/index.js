import { useState } from 'react'
import {
  Box,
  Container,
  Heading,
  Text,
  Textarea,
  Button,
  VStack,
  Code,
  UnorderedList,
  ListItem,
  Link,
  HStack,
  IconButton,
  SimpleGrid,
} from '@chakra-ui/react'
import { CopyIcon, CheckIcon } from '@chakra-ui/icons'
import { compile } from '../lib/compiler'

function highlightCode(code) {
  const keywords = [
    'आरम्भ',
    'समाप्त',
    'मान',
    'मुद्रय',
    'दर्शय',
    'यावत्',
    'यदि',
    'अन्यथा',
    'विराम',
    'अग्रिम',
    'सत्य',
    'असत्य',
    'शून्य',
  ]

  let highlighted = code

  highlighted = highlighted.replace(
    /("([^"\\]|\\.)*"|'([^'\\]|\\.)*')/g,
    '<span style="color: #98C379;">$&</span>'
  )

  highlighted = highlighted.replace(
    /(\/\/.*$)/gm,
    '<span style="color: #5C6370;">$&</span>'
  )

  highlighted = highlighted.replace(
    /(\b\d+\b)/g,
    '<span style="color: #D19A66;">$&</span>'
  )

  keywords.forEach((keyword) => {
    const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'g')
    highlighted = highlighted.replace(regex, '<span style="color: #C678DD;">$1</span>')
  })

  highlighted = highlighted.replace(
    /([{}()])/g,
    '<span style="color: #ABB2BF;">$1</span>'
  )

  return highlighted
}

function CopyableCodeBlock({ code, ...props }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <Box position="relative" {...props}>
      <Box
        p={4}
        borderRadius="md"
        fontSize="sm"
        display="block"
        bg="gray.900"
        color="gray.100"
        border="1px solid"
        borderColor="gray.700"
        fontFamily="mono"
        whiteSpace="pre-wrap"
        overflowX="auto"
        dangerouslySetInnerHTML={{ __html: highlightCode(code) }}
      />
      <IconButton
        aria-label="Copy code"
        icon={copied ? <CheckIcon /> : <CopyIcon />}
        size="sm"
        position="absolute"
        top={2}
        right={2}
        onClick={handleCopy}
        bg="gray.700"
        color="white"
        _hover={{ bg: 'gray.600' }}
      />
    </Box>
  )
}

const defaultCode = `मान x = 3

यावत् (x > 0) {
  मुद्रय("नमस्ते")
  x = x - 1
}`

export default function Home() {
  const [code, setCode] = useState(defaultCode)
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)

  const handleRun = () => {
    setIsRunning(true)
    setOutput('')

    try {
      const capturedLogs = []
      const originalLog = console.log

      console.log = (...args) => {
        capturedLogs.push(
          args
            .map((arg) =>
              typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
            )
            .join(' ')
        )
      }

      const jsCode = compile(code)
      const func = new Function(jsCode)
      func()

      console.log = originalLog

      if (capturedLogs.length === 0) {
        setOutput('(no output)')
      } else {
        setOutput(capturedLogs.join('\n'))
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`)
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <Box
      minH="100vh"
      bgGradient="linear(to-b, parchment.100, parchment.200)"
      bgImage="radial-gradient(circle at 0 0, rgba(218, 165, 32, 0.06) 0, transparent 55%), radial-gradient(circle at 100% 0, rgba(139, 0, 0, 0.05) 0, transparent 55%)"
      bgRepeat="no-repeat"
    >
      <Container maxW={{ base: '100%', md: '1000px' }} py={{ base: 8, md: 12 }} px={{ base: 4, md: 6 }}>
        <VStack spacing={10} align="stretch">
          <Box textAlign="center" py={12} position="relative">
            <Box
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              width="120%"
              height="120%"
              bgGradient="radial(circle, rgba(218, 165, 32, 0.15) 0%, transparent 70%)"
              zIndex={0}
              pointerEvents="none"
            />
            <Heading
              as="h1"
              fontSize={{ base: '3.5rem', md: '6rem', lg: '8rem' }}
              mb={6}
              fontFamily="ancient"
              fontWeight="700"
              letterSpacing="0.2em"
              bgGradient="linear(135deg, #DAA520 0%, #FF9933 25%, #8B0000 50%, #4B0082 75%, #DAA520 100%)"
              bgClip="text"
              textShadow="0 4px 8px rgba(218, 165, 32, 0.4), 0 8px 16px rgba(139, 0, 0, 0.3), 0 12px 24px rgba(75, 0, 130, 0.2)"
              position="relative"
              zIndex={1}
              textTransform="uppercase"
              style={{
                WebkitTextStroke: '2px rgba(218, 165, 32, 0.2)',
                filter: 'drop-shadow(0 4px 8px rgba(139, 0, 0, 0.4))',
                textRendering: 'optimizeLegibility',
              }}
            >
              SUTRA
            </Heading>
            <Text fontSize="xl" color="gray.700" mb={3} fontWeight="500">
              A tiny Sanskrit-style joke language that compiles to JavaScript.
            </Text>
            <Text fontSize="md" color="gray.600" fontStyle="italic">
              Made for fun. Built for learning. Not for production. Built for NASA (just kidding).
            </Text>
          </Box>

          <Box
            bg="parchment.50"
            p={{ base: 6, md: 8 }}
            borderRadius="xl"
            boxShadow="lg"
            border="1px solid"
            borderColor="ancient.gold"
          >
            <Heading as="h2" size="lg" mb={6} fontFamily="heading" color="ancient.deepRed">
              Playground
            </Heading>
            <VStack spacing={5} align="stretch">
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                fontFamily="mono"
                fontSize="sm"
                minH="250px"
                bg="gray.50"
                borderColor="gray.300"
                _focus={{
                  borderColor: 'gray.500',
                  boxShadow: '0 0 0 1px gray.500',
                }}
                spellCheck={false}
                resize="vertical"
              />
              <Button
                colorScheme="gray"
                size="lg"
                onClick={handleRun}
                isLoading={isRunning}
                loadingText="Running..."
                fontWeight="600"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'md',
                }}
                transition="all 0.2s"
              >
                Run
              </Button>
              <Box>
                <Text fontSize="sm" color="gray.600" mb={2} fontWeight="500">
                  Output:
                </Text>
                <Box
                  bg="gray.900"
                  color="gray.100"
                  p={5}
                  borderRadius="lg"
                  minH="80px"
                  fontFamily="mono"
                  fontSize="sm"
                  whiteSpace="pre-wrap"
                  border="1px solid"
                  borderColor="gray.700"
                >
                  {output || '\u00A0'}
                </Box>
              </Box>
            </VStack>
          </Box>

          <Box
            textAlign="center"
            bg="parchment.50"
            p={{ base: 6, md: 8 }}
            borderRadius="xl"
            boxShadow="lg"
            border="1px solid"
            borderColor="ancient.gold"
          >
            <Heading as="h2" size="lg" mb={6} fontFamily="heading" color="ancient.deepRed">
              Install
            </Heading>
            <VStack spacing={4}>
              <Code
                p={4}
                borderRadius="lg"
                fontSize="md"
                display="block"
                bg="gray.50"
                color="gray.800"
                border="1px solid"
                borderColor="gray.200"
                w="100%"
                maxW="500px"
              >
                npm install -g sutra
              </Code>
              <Code
                p={4}
                borderRadius="lg"
                fontSize="md"
                display="block"
                bg="gray.50"
                color="gray.800"
                border="1px solid"
                borderColor="gray.200"
                w="100%"
                maxW="500px"
              >
                sutra run hello.skt
              </Code>
            </VStack>
          </Box>

          <Box
            bg="parchment.50"
            p={{ base: 6, md: 8 }}
            borderRadius="xl"
            boxShadow="lg"
            border="1px solid"
            borderColor="ancient.gold"
          >
            <Heading as="h2" size="lg" mb={6} fontFamily="heading" color="ancient.deepRed">
              Documentation
            </Heading>
            <Text fontSize="md" color="gray.600" mb={6}>
              Sutra is a tiny Sanskrit-style joke language that compiles to JavaScript.
            </Text>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 6, md: 8 }}>
              <Box>
                <Heading as="h3" size="md" mb={3} color="ancient.maroon">
                  General
                </Heading>
                <Text fontSize="sm" color="gray.600" mb={3}>
                  आरम्भ and समाप्त are optional program boundaries. If both exist, only code inside them is compiled. If neither exists, the whole file is compiled. Anything outside will be ignored.
                </Text>
                <Text fontSize="xs" color="gray.500" mb={2} fontStyle="italic">
                  This will be ignored
                </Text>
                <CopyableCodeBlock
                  code={`आरम्भ
  // Write code here
समाप्त

This too`}
                />
              </Box>

              <Box>
                <Heading as="h3" size="md" mb={3} color="ancient.maroon">
                  Variables
                </Heading>
                <Text fontSize="sm" color="gray.600" mb={3}>
                  Variables can be declared using मान.
                </Text>
                <CopyableCodeBlock
                  code={`आरम्भ
  मान a = 10;
  मान b = "two";
  मान c = 15;
  a = a + 1;
  b = 21;
  c *= 2;
समाप्त`}
                />
              </Box>

              <Box>
                <Heading as="h3" size="md" mb={3} color="ancient.maroon">
                  Types
                </Heading>
                <Text fontSize="sm" color="gray.600" mb={3}>
                  Numbers and strings are like other languages. शून्य denotes null values. सत्य and असत्य are the boolean values.
                </Text>
                <CopyableCodeBlock
                  code={`आरम्भ
  मान a = 10;
  मान b = 10 + (15*20);
  मान c = "two";
  मान d = 'ok';
  मान e = शून्य;
  मान f = सत्य;
  मान g = असत्य;
समाप्त`}
                />
              </Box>

              <Box>
                <Heading as="h3" size="md" mb={3} color="ancient.maroon">
                  Built-ins
                </Heading>
                <Text fontSize="sm" color="gray.600" mb={3}>
                  Use मुद्रय to print anything to console.
                </Text>
                <CopyableCodeBlock
                  code={`आरम्भ
  मुद्रय("Hello World");
  मान a = 10;
  {
    मान b = 20;
    मुद्रय(a + b);
  }
  मुद्रय(5, 'ok', शून्य, सत्य, असत्य);
समाप्त`}
                />
              </Box>

              <Box>
                <Heading as="h3" size="md" mb={3} color="ancient.maroon">
                  Conditionals
                </Heading>
                <Text fontSize="sm" color="gray.600" mb={3}>
                  Sutra supports if-else construct. यदि block executes if condition is true, otherwise अन्यथा block executes.
                </Text>
                <CopyableCodeBlock
                  code={`आरम्भ
  मान a = 10;
  यदि (a < 20) {
    मुद्रय("a is less than 20");
  } अन्यथा {
    मुद्रय("a is greater than or equal to 20");
  }
समाप्त`}
                />
              </Box>

              <Box>
                <Heading as="h3" size="md" mb={3} color="ancient.maroon">
                  Loops
                </Heading>
                <Text fontSize="sm" color="gray.600" mb={3}>
                  Statements inside यावत् blocks are executed as long as a specified condition evaluates to true. Use विराम to break the loop and अग्रिम to continue within loop.
                </Text>
                <CopyableCodeBlock
                  code={`आरम्भ
  मान a = 0;
  यावत् (a < 10) {
    a += 1;
    यदि (a === 5) {
      मुद्रय("inside loop", a);
      अग्रिम;
    }
    यदि (a === 6) {
      विराम;
    }
    मुद्रय(a);
  }
  मुद्रय("done");
समाप्त`}
                />
              </Box>
            </SimpleGrid>
          </Box>

          <Box
            bg="parchment.50"
            p={{ base: 6, md: 8 }}
            borderRadius="xl"
            boxShadow="lg"
            border="1px solid"
            borderColor="ancient.gold"
          >
            <Heading as="h2" size="lg" mb={6} fontFamily="heading" color="ancient.deepRed">
              Why Sutra Exists
            </Heading>
            <UnorderedList spacing={3} fontSize="lg" color="gray.700">
              <ListItem>For fun</ListItem>
              <ListItem>To learn how compilers work</ListItem>
              <ListItem>Because not everything needs a reason</ListItem>
            </UnorderedList>
          </Box>

          <Box
            textAlign="center"
            py={8}
            mt={8}
            borderTop="1px solid"
            borderColor="gray.300"
          >
            <Text fontSize="md" color="gray.600" mb={3} fontWeight="500">
              Created by{' '}
              <Link
                href="https://github.com/tarunjawla"
                isExternal
                color="gray.800"
                fontWeight="600"
                textDecoration="underline"
                _hover={{ color: 'gray.600' }}
              >
                Tarun Jawla
              </Link>
            </Text>
            <HStack spacing={4} justify="center" flexWrap="wrap">
              <Link
                href="https://github.com/tarunjawla"
                isExternal
                color="gray.600"
                fontSize="sm"
                _hover={{ color: 'gray.800', textDecoration: 'underline' }}
              >
                GitHub
              </Link>
              <Text color="gray.400">•</Text>
              <Link
                href="https://tarunjawla.com"
                isExternal
                color="gray.600"
                fontSize="sm"
                _hover={{ color: 'gray.800', textDecoration: 'underline' }}
              >
                Website
              </Link>
            </HStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  )
}

