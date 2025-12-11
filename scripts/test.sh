#!/bin/bash
# Test runner script that handles Node version differences
# Node 25+ requires --localstorage-file flag
# Node 20/22 don't need it

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)

if [ "$NODE_VERSION" -ge 25 ]; then
  # Node 25+: requires --localstorage-file flag
  export NODE_OPTIONS="--experimental-vm-modules --localstorage-file=/tmp/jest-ls"
else
  # Node 20/22: don't need the flag
  export NODE_OPTIONS="--experimental-vm-modules"
fi

# Pass all arguments to jest (e.g., --ci, --coverage, --watch)
exec npx jest "$@"
