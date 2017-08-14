#!/usr/bin/env node
const chokidar        = require('chokidar')
const fs              = require('fs')
const { spawn, exec } = require('child_process')
const { SourceCode, CLIEngine } = require('eslint')
const chalk           = require('chalk')
const process         = require('process')
const kexec           = require('kexec')

const CHOKIDAR_OPTIONS = {'ignored':/[\/\\]\./, 'ignoreInitial':true}
const REQUIRED_NODE_VERSION = 'v6.11.1'
const BROWSERIFY_ARGS = `-o build/browserified.js --ignore node-localstorage \
  --ignore xmlhttprequest --debug src/index.js \
  --exclude react --exclude react-dom \
  -t babelify`

if (process.version !== REQUIRED_NODE_VERSION) {
  throw new Error(`Currently running ${process.version}.  Please first run:
      nvm use ${REQUIRED_NODE_VERSION} (may need to rerun npm install)`)
}

// argv[0] is node
// argv[1] is path to script
// argv[2] is optional 'main' or 'test'
if (process.argv.length > 3) {
  throw new Error("Too many command-line arguments")
} else if (process.argv.length === 3) {
  if (process.argv[2] === 'main') {
    kexec('node', ['./build/src/main.js'])
  } else if (process.argv[2] === 'test') {
    kexec('node_modules/.bin/mocha', ['build/test'])
  } else {
    throw new Error("Unknown argv[2]")
  }
}

const spawned = spawn('/bin/bash', ['-c', `echo Running flow &&
  node_modules/.bin/flow &&
  JS_FILES="$(find src -name '*.js') $(find test -name '*.js')" &&
  mkdir -p build &&
  echo Running eslint &&
  node_modules/.bin/eslint $(find src -name '*.js') &&
  echo Running browserify &&
  node_modules/.bin/browserify ${BROWSERIFY_ARGS} &&
  cp src/index.html build/index.html
`])
spawned.stdout.on('data', (data) => { console.log(data.toString().trim()) })
spawned.stderr.on('data', (data) => { console.log(data.toString().trim()) })
spawned.on('close', (code) => {
  if (code !== 0) { process.exit(1) }
  console.log('Build done')
  exec('afplay /System/Library/Sounds/Pop.aiff') // success sound

  const spawned2 = spawn('node_modules/.bin/watchify',
    BROWSERIFY_ARGS.split(' '))
  spawned2.stdout.on('data', (data) => {
    console.log(data.toString().trim())
  })
  spawned2.stderr.on('data', (data) => {
    console.log(data.toString().trim())
  })
})

function buildError(message) {
  console.log('buildError')
  console.log(message)

  console.log(`osascript -e 'display notification "${message}" with title "Build failed"'`)
  exec(`osascript -e 'display notification "${message}" with title "Build failed"'`)

  exec("afplay /System/Library/Sounds/Funk.aiff")

  try {
    fs.unlinkSync('build/browserified.js')
  } catch (e) {
    if (e.code !== 'ENOENT') {
      throw e
    }
  }
}

// Every time a file is edited, build that file
chokidar.watch(['src', 'test'], CHOKIDAR_OPTIONS).on('all', (event, path) => {
  console.log(chalk.gray(`Detected ${event} of ${path}`))
  if ((event === 'change' || event === 'add') && path.endsWith('.js')) {
    const spawned = spawn('node_modules/.bin/flow')
    spawned.stdout.on('data', (data) => { console.log(data.toString().trim()) })
    spawned.stderr.on('data', (data) => { console.log(data.toString().trim()) })
    spawned.on('close', (code) => {
      if (code !== 0) {
        return buildError(
          `Got non-zero code ${code} from spawn node_modules/.bin/flow`)
      }

      const spawned3 = spawn('node_modules/.bin/eslint', [path])
      spawned3.stdout.on('data', (data) => {
        console.log(data.toString().trim())
      })
      spawned3.stderr.on('data', (data) => {
        console.log(data.toString().trim())
      })
      spawned3.on('close', (code) => {
        if (code === 0) {
          exec('afplay /System/Library/Sounds/Pop.aiff') // success sound
        } else {
          return buildError(`Error from eslint`)
        }
      })
    })
  }
})

//echo "Google Closure Compiler..."
//java -jar node_modules/google-closure-compiler//compiler.jar \
//  --compilation_level ADVANCED_OPTIMIZATIONS --js build/browserified.js \
//  > build/browserified.min.js
