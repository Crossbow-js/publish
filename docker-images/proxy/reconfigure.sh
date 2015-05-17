#!/usr/bin/env bash
sed 's/{{pass}}/0.0.0.0:8080/' /temp/api-conf > /etc/nginx/conf.d/api.vvlunch.co.uk.conf
nginx -s reload
echo 'reloaded'