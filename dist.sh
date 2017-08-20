#!/bin/bash -ex
cd `dirname $0`

rm -rf dist/*
mkdir -p dist dist/js dist/css

cp src/css/*.css dist/css

echo > dist/js/vendor.js
cat node_modules/react/dist/react.min.js >> dist/js/vendor.js
cat node_modules/react-dom/dist/react-dom.min.js >> dist/js/vendor.js

node_modules/.bin/browserify \
  -o dist/js/browserified.js --ignore node-localstorage \
  --ignore xmlhttprequest src/js/index.js \
  --exclude react --exclude react-dom \
  -t babelify -t uglifyify

rm -f dist/assets.json
node_modules/hashmark/bin/hashmark dist/css/*.css -r true -l 5 -m dist/assets.json 'dist/css/{name}.{hash}{ext}'
node_modules/hashmark/bin/hashmark dist/js/*.js -r true -l 5 -m dist/assets.json 'dist/js/{name}.{hash}{ext}'

ruby -e "
require 'json'
assets = JSON.load(File.read('dist/assets.json'))
assets.each do |key, value|
  value.gsub! 'dist/', ''
end

index = File.read('src/index.html')
index.gsub! '/css/app.css', assets.fetch('dist/css/app.css')
index.gsub! '/js/vendor.js', assets.fetch('dist/js/vendor.js')
index.gsub! '/js/browserified.js', assets.fetch('dist/js/browserified.js')
File.open('dist/index.html', 'w') do |f|
  f.write index
end

File.open('dist/cache.manifest', 'w') do |f|
  f.write 'CACHE MANIFEST' + 10.chr
  f.write '# MD5 of dist/index.html is ' + \`md5 dist/index.html\` + 10.chr
  assets.each do |key, value|
    f.write value + 10.chr
  end
end
"
