#!/usr/bin/env bash
eval "$(boot2docker shellinit)" && export MONGO_PORT_27017_TCP_ADDR="$(boot2docker ip)" export MONGO_PORT_27017_TCP_PORT=4001
./test-clean.sh
export CBDEST=$(pwd)/releases
docker run --name mongotest -p 4001:27017 -d mongo --smallfiles
node   stubs/stub.js
node   node_modules/mocha/bin/mocha test --recursive
./test-clean.sh
