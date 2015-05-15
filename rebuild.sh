#!/usr/bin/env bash
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)
docker build -t node-release .
docker build -t nginx-server docker-images/proxy
docker run -p 80:80 -v /root/sites:/var/www/sites --name proxy -d nginx-server
docker run -p 8080:8080 -e CBDEST=/var/www/sites -v /root/sites:/var/www/sites -d node-release