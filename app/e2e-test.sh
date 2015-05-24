#!/usr/bin/env bash
export MONGO_PORT_27017_TCP_ADDR="$(boot2docker ip)" export MONGO_PORT_27017_TCP_PORT=4001
./node_modules/protractor/bin/protractor test/e2e/config.js
