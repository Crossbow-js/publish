#!/usr/bin/env bash
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)
docker build -t node-release release
docker build -t node-app     app
docker build -t nginx-server proxy
./start.sh