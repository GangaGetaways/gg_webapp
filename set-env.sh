#!/bin/bash

if [ "$ENVIRONMENT" = "dev" ]; then
  cp /env/.env.dev .env
elif [ "$ENVIRONMENT" = "uat" ]; then
  cp /env/.env.uat .env
elif [ "$ENVIRONMENT" = "prod" ]; then
  cp /env/.env.prod .env
else
  echo "Unknown environment"
  exit 1
fi

echo "Environment Set :: $ENVIRONMENT"