#!/usr/bin/env bash

mkdir -p lossy-opti-sh

if [[ -z $1 ]]
then
echo "Put a file name"

exit -1
fi


./jpegoptim --strip-iptc  --strip-icc -o  --strip-all --dest="lossy-opti-sh" --max=85  $1