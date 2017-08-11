#!/usr/bin/env node
const chokidar        = require('chokidar')
const flowRemoveTypes = require('flow-remove-types')
const fs              = require('fs')
const { spawn, exec } = require('child_process')
const { JSHINT }      = require('jshint')
const chalk           = require('chalk')
const process         = require('process')
const kexec           = require('kexec')

// Keep synced with .jshintrc
const JSHINT_OPTIONS = { 'asi': true, 'esversion': 6 }

const CHOKIDAR_OPTIONS = {'ignored':/[\/\\]\./, 'ignoreInitial':true}
const REQUIRED_NODE_VERSION = 'v6.11.1'
const BROWSERIFY_ARGS = `-o build/browserified.js --ignore node-localstorage --ignore xmlhttprequest --debug build/src/app.js`

if (process.version !== REQUIRED_NODE_VERSION) {
  throw new Error(`Currently running ${process.version}.  Please first run: nvm use ${REQUIRED_NODE_VERSION} (may need to rerun npm install)`)
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
  grep ';$' $JS_FILES
  if [ "$?" == "0" ]; then exit 1; fi &&
  rm -rf build &&
  node_modules/.bin/flow-remove-types --out-dir build $JS_FILES &&
  echo Running jshint &&
  node_modules/.bin/jshint $(find build -name '*.js') &&
  echo Running browserify &&
  node_modules/.bin/browserify build/src/app.js ${BROWSERIFY_ARGS} &&
  cp src/index.html build/index.html
`])
spawned.stdout.on('data', (data) => { console.log(data.toString().trim()) })
spawned.stderr.on('data', (data) => { console.log(data.toString().trim()) })
spawned.on('close', (code) => {
  if (code !== 0) { process.exit(1) }
  console.log('Build done')
  exec('afplay /System/Library/Sounds/Pop.aiff') // success sound
})

function buildError(message) {
  console.log(message)

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
        return buildError(`Got non-zero code ${code} from spawn node_modules/.bin/flow`)
      }

      const flowSource = fs.readFileSync(path, 'utf8')
      for (const line of flowSource.split('\n')) {
        if (line.endsWith(';')) {
          return buildError(`Line ends with semicolon: ${line}`)
        }
      }

      let flowRemovedSource
      try {
        flowRemovedSource = flowRemoveTypes(flowSource)
      } catch (e) {
        return buildError(e)
      }
      fs.writeFileSync(`build/${path}`, flowRemovedSource)

      const spawned2 = spawn('node_modules/.bin/watchify',
         BROWSERIFY_ARGS.split(' '))
      spawned2.stdout.on('data', (data) => { console.log(data.toString().trim()) })
      spawned2.stderr.on('data', (data) => { console.log(data.toString().trim()) })

      JSHINT(flowRemovedSource.toString(), JSHINT_OPTIONS, {})
      if (JSHINT.errors.length > 0) {
        return buildError(JSHINT.errors)
      }

      exec('afplay /System/Library/Sounds/Pop.aiff') // success sound
      exec(`osascript -e 'display notification "Success" with title "Build succeeded"'`)
    })
  }
})

//echo "Google Closure Compiler..."
//java -jar node_modules/google-closure-compiler//compiler.jar \
//  --compilation_level ADVANCED_OPTIMIZATIONS --js build/browserified.js \
//  > build/browserified.min.js
