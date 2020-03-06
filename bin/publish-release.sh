#!/bin/bash

read -p 'Please enter an appropriate GitHub personal access token so that the release can be pushed. > ' token

if [ -z $token ] ; then
    echo "A token was not provided. Exiting."
    exit -1
fi

read -p 'Should I bump the patch version number? [y/N] ' resp
if [ "$resp" == 'y' ] ; then
    npm version patch 
fi
read -p 'Should I bump the minor version number? [y/N] ' resp
if [ "$resp" == 'y' ] ; then
    npm version minor
fi
read -p 'Should I bump the major version number? [y/N] ' resp
if [ "$resp" == 'y' ] ; then
    npm version major 
fi

export GH_TOKEN="${token}"
npm run build:linux
npm run build:mac
npm run build:win

PACKAGE_VERSION=$(awk '/version/{gsub(/("|",)/,"",$2);print $2};' package.json)
git tag -a "v${PACKAGE_VERSION}" -e
  
npm run publish

cat <<EOF

    You can now go to https://github.com/UTS-Research/describo/releases
    to verify the draft and release it.

EOF