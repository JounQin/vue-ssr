#!/usr/bin/env bash

rm -rf dist
git clone https://github.com/JounQin/vue-ssr.git dist -b assets
rm -rf dist/.git
