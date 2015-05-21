#!/usr/bin/env bash
docker exec mongo mongo test --eval "db.dropDatabase()"