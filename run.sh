#!/usr/bin/env bash
docker run -p 80:80 -v $(pwd)/sites:/var/www/sites --name proxy -d nginx-server
docker run -p 8080:8080 -e CBDEST=/var/www/sites -v $(pwd)/sites:/var/www/sites -d node-release