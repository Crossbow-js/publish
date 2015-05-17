#!/usr/bin/env bash
mkdir -p /Users/shakyshane/crossbow/publish/data/db
docker run --name db-data -v /Users/shakyshane/crossbow/publish/data:/data busybox
docker run --name mongo   --volumes-from db-data -d mongo
docker run --name app     -v /root/sites:/var/www/sites --link mongo:mongo -e CBDEST=/var/www/app   -d node-app
docker run --name release -v /root/sites:/var/www/sites --link mongo:mongo -e CBDEST=/var/www/sites -d node-release
docker run --name proxy   -p 80:80 --link release:node-release --link app:node-app -v /root/sites:/var/www/sites -d nginx-server