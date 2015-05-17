#!/usr/bin/env bash
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)
docker build -t node-release .
docker build -t nginx-server docker-images/proxy
docker run -p 8080:8080 --name release -v /root/sites:/var/www/sites -e CBDEST=/var/www/sites -d node-release
docker run -p 80:80     -it --name proxy  --link release:node-release -v /root/sites:/var/www/sites -d nginx-server
