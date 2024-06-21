#!/bin/zsh

set -x
set -e

# build expo for web
cd ../.. && yarn nx export expo
cd ./apps/electron

# hack rn?
# rm -rf ../../node_modules/react-native/template/ios
# rm -rf ./node_modules/react-native/template/ios

mkdir -p ./build
cp -r ./public/* ./build
cp -r ../expo/dist/* ./build

# replace absolute with relative paths for electron
# sed -i '' "s#/static#./static#g" build/index.html
sed -i '' "s#/_expo#_expo#g" build/index.html
# sed -i '' 's#"//#"https://#g' build/index.html
