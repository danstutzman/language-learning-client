## How to test from browser

`nvm use v6.11.1`

`./build_and_watch.js`

`cd build`

`../node_modules/.bin/http-server`

Go to http://localhost:8080

## How to run automated tests

`nvm use v6.11.1`

`node_modules/.bin/mocha test --compilers js:babel-core/register`

## How to run server-side code

`nvm use v6.11.1`

`./run`

## How to test from a mobile device

Start backend (seperate repo) on port 3000

`node_modules/.bin/lt --port 3000 -s serverdts`

`node_modules/.bin/lt --port 8080 -s clientdts`

In mobile device, browse to https://clientdts.localtunnel.me
