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
  Icon,
} from '@chakra-ui/react'
import { compile } from '../lib/compiler'

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
    <Box minH="100vh" bg="parchment.100">
      <Container maxW="1000px" py={12}>
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
              fontSize={{ base: '5rem', md: '7rem', lg: '9rem' }}
              mb={6}
              fontFamily="ancient"
              fontWeight="700"
              letterSpacing="0.15em"
              bgGradient="linear(135deg, #DAA520 0%, #FF9933 25%, #8B0000 50%, #4B0082 75%, #DAA520 100%)"
              bgClip="text"
              textShadow="0 4px 8px rgba(218, 165, 32, 0.4), 0 8px 16px rgba(139, 0, 0, 0.3), 0 12px 24px rgba(75, 0, 130, 0.2)"
              position="relative"
              zIndex={1}
              style={{
                WebkitTextStroke: '2px rgba(218, 165, 32, 0.2)',
                filter: 'drop-shadow(0 4px 8px rgba(139, 0, 0, 0.4))',
                textRendering: 'optimizeLegibility',
              }}
            >
              सूत्र
            </Heading>
            <Text
              fontSize={{ base: '1.5rem', md: '2rem' }}
              color="ancient.deepRed"
              fontWeight="600"
              letterSpacing="0.3em"
              mt={-6}
              mb={2}
              fontFamily="ancient"
              textTransform="uppercase"
              position="relative"
              zIndex={1}
              textShadow="0 2px 4px rgba(139, 0, 0, 0.2)"
            >
              SUTRA
            </Text>
            <Text fontSize="xl" color="gray.700" mb={3} fontWeight="500">
              A tiny Sanskrit-style joke language that compiles to JavaScript.
            </Text>
            <Text fontSize="md" color="gray.600" fontStyle="italic">
              Made for fun. Built for learning. Not for production.
            </Text>
          </Box>

          <Box
            bg="white"
            p={8}
            borderRadius="xl"
            boxShadow="lg"
            border="1px solid"
            borderColor="gray.200"
          >
            <Heading as="h2" size="lg" mb={6} fontFamily="heading" color="gray.800">
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
            bg="white"
            p={8}
            borderRadius="xl"
            boxShadow="lg"
            border="1px solid"
            borderColor="gray.200"
          >
            <Heading as="h2" size="lg" mb={6} fontFamily="heading" color="gray.800">
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
            bg="white"
            p={8}
            borderRadius="xl"
            boxShadow="lg"
            border="1px solid"
            borderColor="gray.200"
          >
            <Heading as="h2" size="lg" mb={6} fontFamily="heading" color="gray.800">
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

