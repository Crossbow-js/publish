#!/usr/bin/env bash
./cleardb.sh
./node_modules/protractor/bin/protractor test/e2e/config.js
./cleardb.sh
