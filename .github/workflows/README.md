# CI/CD Pipeline Documentation

## Overview

This project uses GitHub Actions for continuous integration and deployment. The CI/CD pipeline automatically runs tests, performs security audits, checks code quality, and builds the project on every push and pull request.

## Workflows

### 1. CI/CD Pipeline (`ci.yml`)

This is the main workflow that runs on:
- **Push events** to branches: `main`, `develop`, and any branch starting with `SPMA-*`
- **Pull requests** targeting `main` or `develop` branches

#### Jobs

##### Test Job
- **Runs on**: Ubuntu Latest
- **Node versions tested**: 20.x, 22.x (matrix strategy)
- **Steps**:
  1. Checkout code
  2. Setup Node.js with caching
  3. Install dependencies with `npm ci`
  4. Run linter (if configured)
  5. Run tests with coverage using `npm run test:ci`
  6. Upload coverage reports to Codecov (Node 20.x only)

##### Build Job
- **Runs on**: Ubuntu Latest
- **Depends on**: Test job must pass
- **Steps**:
  1. Checkout code
  2. Setup Node.js 20.x with caching
  3. Install dependencies with `npm ci`
  4. Build the project with `npm run build`
  5. Verify build output (checks for `dist/` directory and `dist/server.js`)
  6. Upload build artifacts (retained for 7 days)

##### Security Job
- **Runs on**: Ubuntu Latest
- **Steps**:
  1. Run `npm audit` at moderate level (continues on error)
  2. Run `npm audit` at high level (fails on high/critical vulnerabilities)

##### Type Check Job
- **Runs on**: Ubuntu Latest
- **Steps**:
  1. Install dependencies
  2. Run TypeScript compiler in check mode (`tsc --noEmit`)

##### Code Quality Job
- **Runs on**: Ubuntu Latest (only on PRs)
- **Depends on**: Test and Build jobs
- **Steps**:
  1. Generate coverage report
  2. Comment on PR with coverage information

## Configuration Requirements

### Repository Secrets

The following secrets should be configured in your GitHub repository settings:

1. **`CODECOV_TOKEN`** (Optional)
   - Required for uploading coverage reports to Codecov
   - Get from: https://codecov.io/
   - Used by: Test job

2. **`GITHUB_TOKEN`** (Automatic)
   - Automatically provided by GitHub Actions
   - No configuration needed

### Build Configuration

The build process is configured in `tsconfig.json`:
- **Output directory**: `./dist`
- **Source directory**: `./src`
- **Excluded from build**: Test files (`**/__tests__/**`, `**/*.test.ts`, `**/*.spec.ts`)

### Test Configuration

Tests run with special Node.js options for ES modules support:
```bash
NODE_OPTIONS='--experimental-vm-modules --localstorage-file=/tmp/jest-ls'
```

Available test scripts:
- `npm test` - Run tests once
- `npm run test:ci` - Run tests in CI mode with coverage
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report

## Branch Protection Rules (Recommended)

Configure the following branch protection rules for `main` and `develop`:

1. **Require pull request reviews**: At least 1 approval
2. **Require status checks to pass**:
   - Test (Node 20.x)
   - Test (Node 22.x)
   - Build
   - Security Audit
   - TypeScript Type Check
3. **Require branches to be up to date**: Enabled
4. **Do not allow bypassing**: Enabled for administrators

## Workflow Triggers

### Push Triggers
- Pushes to `main` branch
- Pushes to `develop` branch
- Pushes to any branch matching `SPMA-*` pattern

### Pull Request Triggers
- PRs targeting `main` branch
- PRs targeting `develop` branch

## Artifacts

Build artifacts are automatically uploaded and can be downloaded from:
- GitHub Actions workflow run page
- Artifact name: `build-artifacts`
- Contents: Compiled JavaScript files from `dist/` directory
- Retention: 7 days

## Viewing Results

### In GitHub UI
1. Go to the **Actions** tab in your repository
2. Click on a workflow run to see details
3. Click on individual jobs to see logs
4. Download artifacts from the **Artifacts** section

### Status Badges

Add the following badge to your README.md to show build status:

```markdown
![CI/CD Pipeline](https://github.com/taberj-git/soleo-spike-api/workflows/CI%2FCD%20Pipeline/badge.svg)
```

## Troubleshooting

### Test Failures
- Check the test job logs for specific test failures
- Run tests locally: `npm test`
- Ensure all dependencies are installed: `npm ci`

### Build Failures
- Check TypeScript compilation errors
- Run build locally: `npm run build`
- Verify tsconfig.json excludes test files

### Security Audit Failures
- Review the security job logs for vulnerable packages
- Update packages: `npm update`
- Check for security advisories: `npm audit`
- Apply fixes: `npm audit fix`

### Coverage Upload Failures
- Verify `CODECOV_TOKEN` is configured
- Coverage upload failures don't fail the build (continue-on-error: true)

## Local Testing

Before pushing, test locally:

```bash
# Install dependencies
npm ci

# Run linter
npm run lint

# Run tests
npm test

# Run build
npm run build

# Check TypeScript types
npx tsc --noEmit

# Security audit
npm audit
```

## Future Enhancements

Consider adding:
- Deployment workflows (staging/production)
- Performance testing
- E2E testing
- Docker image building
- Slack/Discord notifications
- Auto-merge for dependabot PRs
- Release automation
