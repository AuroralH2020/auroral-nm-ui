# AURORAL NEIGHBOURHOOD MANAGER UI #

This README documents the web interface of the AURORAL Neighbourhood Manager, which is funded by European Union’s Horizon 2020 Framework Programme for Research and Innovation under grant agreement no 101016854 AURORAL.

### Deployment ###

Docker is the preferred deployment method and NGINX is used as HTTP server.

1. Create your environment variables with your API host address and other defaults for your deployment. Add the file as ./vicinityManager/environments/environments/env.{env_name}.js

2. Building an image:
    docker build --build-arg MY_ENV={env_name} --tag {image_name} -f Dockerfile .

3. Run image
    docker run -p 80:80 --name {container_name} {image_name}

### Who do I talk to? ###

Developed by bAvenir

* jorge.almela@bavenir.eu
* peter.drahovsky@bavenir.eu