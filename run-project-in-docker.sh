#!/usr/bin/env bash
docker build -t slim3-twig-app .
docker run -it --rm -p 8888:8888 --name fuzo-frontend slim3-twig-app
