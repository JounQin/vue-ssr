#!/usr/bin/env bash

set -e
git pull origin master
yarn
cross-env yarn build
pm2 delete vue-ssr
yarn pm2
