#!/bin/zsh

mkdir -p Icon.iconset
sips -z 16 16     Icon_1536x1536.png --out Icon.iconset/icon_16x16.png
sips -z 32 32     Icon_1536x1536.png --out Icon.iconset/icon_16x16@2x.png
sips -z 32 32     Icon_1536x1536.png --out Icon.iconset/icon_32x32.png
sips -z 64 64     Icon_1536x1536.png --out Icon.iconset/icon_32x32@2x.png
sips -z 128 128   Icon_1536x1536.png --out Icon.iconset/icon_128x128.png
sips -z 256 256   Icon_1536x1536.png --out Icon.iconset/icon_128x128@2x.png
sips -z 256 256   Icon_1536x1536.png --out Icon.iconset/icon_256x256.png
sips -z 512 512   Icon_1536x1536.png --out Icon.iconset/icon_256x256@2x.png
sips -z 512 512   Icon_1536x1536.png --out Icon.iconset/icon_512x512.png
sips -z 1024 1024   Icon_1536x1536.png --out Icon.iconset/icon_512x512@2x.png
# cp Icon_1536x1536.png Icon.iconset/icon_512x512@2x.png
iconutil -c icns Icon.iconset
rm -R Icon.iconset
