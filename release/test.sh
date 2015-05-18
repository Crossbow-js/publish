#!/usr/bin/env bash
eval "$(boot2docker shellinit)" && export DKIP="$(boot2docker ip)"
./test-clean.sh
export CBDEST=$(pwd)/releases
docker run --name mongotest -p 4001:27017 -d mongo
node   stubs/stub.js
node   node_modules/mocha/bin/mocha test --recursive
./test-clean.sh
