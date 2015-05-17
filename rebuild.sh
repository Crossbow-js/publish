#!/usr/bin/env bash
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)
docker build -t node-release .
docker build -t nginx-server docker-images/proxy
docker run --name release -v /root/sites:/var/www/sites -e CBDEST=/var/www/sites -d node-release
docker run --name proxy   -p 80:80 --link release:node-release -v /root/sites:/var/www/sites -d nginx-server