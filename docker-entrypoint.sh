#!/usr/bin/env bash

pwd;
ls -la;
touch ./log/app.log;
tail -f ./log/app.log &
php -S 0.0.0.0:8888 -t ./public ./public/index.php
