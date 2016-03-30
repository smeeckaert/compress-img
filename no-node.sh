#!/usr/bin/env bash

mkdir -p lossless-sh
mkdir -p lossy-sh

if [[ -z $1 ]]
then
echo "Put a file name"

exit -1
fi

jpegtran -copy none -optimize $1 > lossless-sh/$1

jpegoptim --strip-iptc  --strip-icc  --strip-all -o -q --dest="lossy-sh" --max=85  $1