#!/usr/bin/env bash
docker build -t slim3-twig-app .
cur_dir=`pwd`;
echo "cur_dir: $cur_dir";
docker run -it -v $cur_dir:/usr/src/slim3-twig-app --rm -p 8888:8888 --name fuzo-frontend slim3-twig-app
