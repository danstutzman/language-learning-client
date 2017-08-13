## How to test from browser

`nvm use v6.11.1`

`./build_and_watch.js`

`node_modules/.bin/http-server`

Go to http://localhost:8080/build/index.html

## How to run automated tests

`nvm use v6.11.1`

`node_modules/.bin/mocha test --compilers js:babel-core/register`
