#!/bin/bash
echo "Environment Coming from build step :: $ENV_TYPE"

if [ "$ENV_TYPE" = "dev" ]; then
  cp /env/.env.dev .env
elif [ "$ENV_TYPE" = "uat" ]; then
  cp /env/.env.uat .env
elif [ "$ENV_TYPE" = "prod" ]; then
  cp /env/.env.prod .env
else
  echo "Unknown environment"
  exit 1
fi

echo "Environment Set :: $ENV_TYPE"