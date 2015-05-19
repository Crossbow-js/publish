#!/usr/bin/env bash
#docker run --name db-data -v $(pwd)/data/db:/data busybox
docker run --name mongo \
    -d mongo --smallfiles

docker run --name app \
    -v /root/sites:/var/www/sites \
    -v $(pwd)/app:/src \
    --link mongo:mongo \
    -e CBDEST=/var/www/app \
    -d node-app

#docker run --name app -v /root/sites:/var/www/sites --link mongo:mongo -e CBDEST=/var/www/app -d node-app

docker run --name release \
    -v /root/sites:/var/www/sites \
    -v $(pwd)/release/node_modules:/src/node_modules \
    --link mongo:mongo \
    -e CBDEST=/var/www/sites \
    -d node-release

#docker run --name release -v /root/sites:/var/www/sites --link mongo:mongo -e CBDEST=/var/www/sites -d node-release

docker run --name proxy -p 80:80 --link release:node-release --link app:node-app -v /root/sites:/var/www/sites -d nginx-server