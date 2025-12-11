# Test Scripts

## Overview

This directory contains helper scripts for running tests across different Node.js versions.

## test.sh

**Purpose**: Automatically detects the Node.js version and sets appropriate flags for Jest testing.

**Problem Solved**: Node.js 25+ requires the `--localstorage-file` flag for Jest tests, but this flag:
- Cannot be set via `NODE_OPTIONS` environment variable (security restriction)
- Is not needed in Node.js 20.x and 22.x
- Causes CI/CD pipelines to fail when hardcoded

**Solution**: This script detects the Node version and conditionally adds the flag only when needed.

### Node Version Behavior

| Node Version | NODE_OPTIONS |
|--------------|--------------|
| 20.x, 22.x   | `--experimental-vm-modules` |
| 25.x+        | `--experimental-vm-modules --localstorage-file=/tmp/jest-ls` |

### Usage

The script is automatically called by npm test commands:

```bash
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage
npm run test:ci       # Run tests in CI mode with coverage
```

### How It Works

1. Detects Node.js major version using `node --version`
2. Sets `NODE_OPTIONS` environment variable based on version
3. Passes all command-line arguments to Jest
4. Uses `exec` to replace the shell process with Jest

### Direct Usage

You can also call the script directly:

```bash
bash scripts/test.sh                    # Run all tests
bash scripts/test.sh --watch            # Watch mode
bash scripts/test.sh --ci --coverage    # CI mode
```

### CI/CD Integration

This script is used in GitHub Actions workflows to ensure tests run correctly on both:
- **Local development**: Node 25+ (requires --localstorage-file)
- **CI pipeline**: Node 20.x and 22.x (doesn't need the flag)

The CI workflow in `.github/workflows/ci.yml` simply runs `npm run test:ci`, which delegates to this script for version detection.

### Troubleshooting

**Tests fail with "Cannot initialize local storage" error**:
- Check Node version: `node --version`
- Verify script is executable: `chmod +x scripts/test.sh`
- Try running script directly: `bash scripts/test.sh`

**Script not found error**:
- Ensure you're in the project root directory
- Verify script exists: `ls -la scripts/test.sh`
