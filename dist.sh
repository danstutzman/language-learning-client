#!/bin/bash -ex
cd `dirname $0`

rm -rf dist/*
mkdir -p dist dist/js

echo > dist/js/vendor.js
cat node_modules/react/dist/react.min.js >> dist/js/vendor.js
cat node_modules/react-dom/dist/react-dom.min.js >> dist/js/vendor.js

node_modules/.bin/browserify \
  -o dist/js/browserified.js --ignore node-localstorage \
  --ignore xmlhttprequest src/index.js \
  --exclude react --exclude react-dom \
  -t babelify -t uglifyify

rm -f dist/assets.json
node_modules/hashmark/bin/hashmark dist/js/*.js -r true -l 5 -m dist/assets.json 'dist/js/{name}.{hash}{ext}'

ruby -e "
require 'json'
assets = JSON.load(File.read('dist/assets.json'))
assets.each do |key, value|
  value.gsub! 'dist/', ''
end
index = File.read('src/index.html')
index.gsub! '/js/vendor.js', assets.fetch('dist/js/vendor.js')
index.gsub! '/js/browserified.js', assets.fetch('dist/js/browserified.js')
File.open('dist/index.html', 'w') do |f|
  f.write index
end
"

node_modules/.bin/sw-precache \
  --root=dist \
  --dontCacheBustUrlsMatching=/\\.[0-9a-f]{5}\\./ \
  --staticFileGlobs=dist/js/*.js \
  --staticFileGlobs=dist/index.html
node_modules/.bin/uglifyjs dist/service-worker.js -o dist/service-worker.min.js
