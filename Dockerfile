FROM php:7.2.8-cli-stretch
## COPY . /usr/src/slim3-twig-app
WORKDIR /usr/src/slim3-twig-app
EXPOSE 8888
ENTRYPOINT ./docker-entrypoint.sh
