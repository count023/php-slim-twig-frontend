# php-slim-twig-frontend

PHP frontend for a Content-API for news using Slim and Twig, following the ADR-Pattern and should be run be a react server

## Usage
You will need [composer](https://getcomposer.org/download/) and [docker](https://www.docker.com/get-docker) to setup this project:
- clone it to a local directory of your choice,
- get [composer](https://getcomposer.org/download/), put it into the directory and run it 
- get [docker](https://www.docker.com/get-docker) and start it
- run `./run-project-in-docker.sh` to (re)create the docker image and start the container (it can be stopped by pressing ^C)
- point your browser to `http://localhost:8888/`

## Resources
- Content-API: it's resumed, this API provides articles in JSON-format
- Slim3: https://www.slimframework.com/
- Twig: https://twig.symfony.com/

## Concepts
- [ADR](https://github.com/pmjones/adr/blob/master/IMPLEMENTATION.md)

## Inspired by:
- Slim3 and Twig: https://github.com/akrabat/slim3-skeleton
- Slim3 and ADR: https://github.com/geggleto/blog
- ReactPHP-Server: https://github.com/mbarquin/reactphp-slim
