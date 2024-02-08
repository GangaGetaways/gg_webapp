#!/bin/bash
echo "Environment Coming from build step :: $ENV_TYPE"

ENV_DIR=/app/env
BASE_DIR=/app

if [ "$ENV_TYPE" = "dev" ]; then
  cp $ENV_DIR/.env.dev $BASE_DIR/.env
elif [ "$ENV_TYPE" = "uat" ]; then
  cp $ENV_DIR/.env.uat $BASE_DIR/.env
elif [ "$ENV_TYPE" = "prod" ]; then
  cp $ENV_DIR/.env.prod $BASE_DIR/.env
else
  echo "Unknown environment :: $ENV_TYPE"
  exit 1
fi

echo "Environment Set :: $ENV_TYPE"