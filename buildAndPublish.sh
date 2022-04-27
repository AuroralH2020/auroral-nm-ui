#!/bin/bash
USAGE="$(basename "$0") [ -h ] [ -e env ]
-- Build and publish image to docker registry
-- Flags:
      -h  shows help
      -e  environment [ development (default), prod, ... ]"

# Default configuration
ENV=development
REGISTRY=registry.bavenir.eu
IMAGE_NAME=auroral_nm_ui

# Get configuration
while getopts 'hd:e:' OPTION; do
case "$OPTION" in
    h)
    echo "$USAGE"
    exit 0
    ;;
    e)
    ENV="$OPTARG"
    ;;
esac
done

echo Build and push image ${IMAGE_NAME} with tag ${ENV}

# Do login
docker login ${REGISTRY}


# Multiarch builder
docker buildx use multiplatform

# Build images & push to private registry
docker buildx build --platform linux/amd64 \
                    --tag ${REGISTRY}/${IMAGE_NAME}:${ENV} \
                    --build-arg MY_ENV=${ENV} \
                    -f Dockerfile . --push


# # Build depending on env
# docker build --build-arg MY_ENV=${ENV} --tag ${IMAGE_NAME} -f Dockerfile .

# # Tag the image
# docker image tag ${IMAGE_NAME} ${REGISTRY}/${IMAGE_NAME}:${ENV}

# # Push image
# docker push ${REGISTRY}/${IMAGE_NAME}:${ENV}