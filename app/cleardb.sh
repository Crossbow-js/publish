#!/usr/bin/env bash
docker exec mongotest mongo test --eval "db.dropDatabase()"