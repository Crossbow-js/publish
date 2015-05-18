#!/usr/bin/env bash
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)
docker run --name mongotest -p 4001:27017 -d mongo
node   stub.js
node   node_modules/mocha/bin/mocha test --recursive
