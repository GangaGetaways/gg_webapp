#!/bin/bash
echo "Environment Coming from build step :: $ENV_TYPE"
#Only for local runs.
#ENV_TYPE="local" # for local --
# Default env
ENV_TYPE="dev"
# Get the current working directory
cwd=$(pwd)
echo "Current working dir :: $cwd"

if [ "$ENV_TYPE" = "dev" ]; then
  cp $cwd/env/.env.dev $cwd/.env
elif [ "$ENV_TYPE" = "uat" ]; then
  cp $cwd/env/.env.uat $cwd/.env
elif [ "$ENV_TYPE" = "prod" ]; then
  cp $cwd/env/.env.prod $cwd/.env
elif [ "$ENV_TYPE" = "local" ]; then
  cp $cwd/env/.env.local $cwd/.env
else
  echo "Unknown environment :: $ENV_TYPE"
  exit 1
fi

export ENV_TYPE=$ENV_TYPE

echo "Environment Set :: $ENV_TYPE"