#!/bin/bash


if [ -z "${APPLEID}" ] ; then
    echo "To build this application you will need an Apple Developer Certificate"
    read -p 'What is you Apple ID? ' APPLEID
    if [ -z "${APPLEID}" ] ; then
        echo "Apple ID not provided. Exiting."
        exit -1
    fi
fi
echo
if [ -z "${APPLEIDPASS}" ] ; then
    echo "To build this application you will need an 'App Specific Password'."
    echo "If you don't know what that is read the README for info."
    read -p 'What is you App Specific Password? ' APPLEIDPASS
    if [ -z "${APPLEIDPASS}" ] ; then
        echo "App specific password not provided. Exiting."
        exit -1
    fi
fi
export APPLEID=$APPLEID
export APPLEIDPASS=$APPLEIDPASS
echo 
read -p 'Please enter an appropriate GitHub personal access token so that the release can be pushed. > ' token
if [ -z $token ] ; then
    echo "A token was not provided. Exiting."
    exit -1
fi

echo
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

PACKAGE_VERSION=$(awk '/version/{gsub(/("|",)/,"",$2);print $2};' package.json)
git tag -a "v${PACKAGE_VERSION}" -e
  
# npm run build:linux
npm run build:mac
npm run build:win

cat <<EOF

    You can now go to https://github.com/UTS-Research/describo/releases
    to verify the draft and release it.

EOF