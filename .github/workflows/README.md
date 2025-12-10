# CI/CD Pipeline Documentation

## What is CI/CD?

**CI/CD** stands for **Continuous Integration / Continuous Deployment**. It's an automated pipeline that runs quality checks on your code whenever you push commits or create pull requests. Think of it as an automated quality gate that ensures code meets standards before merging.

The `ci.yml` file defines this pipeline. When you push code, GitHub automatically:
- Spins up virtual servers (Ubuntu Linux)
- Runs your tests, builds, and security checks
- Reports results with ✅ green checkmarks or ❌ red X's
- All within 2-3 minutes

## Overview

This project uses GitHub Actions for continuous integration and deployment. The CI/CD pipeline automatically runs tests, performs security audits, checks code quality, and builds the project on every push and pull request.

## How It Works

### When the Pipeline Runs

**Trigger Events:**
- **Push**: Automatically runs when you push to `main`, `dev`, or any branch starting with `SPMA-*`
- **Pull Request**: Runs when you create/update PRs targeting `main` or `dev`

### Execution Flow

When you push a commit, here's what happens:

```
Push/PR Created
    ↓
┌───┴───┬──────────┬──────────┐
│       │          │          │
Test   Security  Type-Check  (run in parallel)
│       │          │
│ (passes)
│
Build (waits for Test)
│
│ (if PR only)
│
Code Quality (waits for Test + Build)
```

**Real-World Example:**

1. You push a commit to branch `SPMA-fix-bug`
2. GitHub receives your code and triggers the workflow
3. GitHub spins up 4-5 Ubuntu servers to run jobs in parallel:
   - **Server 1 & 2**: Run all 21 tests on Node 20.x and 22.x
   - **Server 3**: Run security audit (`npm audit`)
   - **Server 4**: Check TypeScript types (`tsc --noEmit`)
4. All tests pass ✅ (21/21)
5. **Server 5**: Build job starts (compiles TypeScript → JavaScript)
6. TypeScript compiles successfully ✅
7. Build artifacts uploaded to GitHub (downloadable `dist/` folder)
8. Workflow completes - you see green checkmarks ✅

If **any job fails**, you get a ❌ and can click to see detailed logs showing exactly what went wrong.

## Workflows

### 1. CI/CD Pipeline (`ci.yml`)

This is the main workflow that runs on:
- **Push events** to branches: `main`, `dev`, and any branch starting with `SPMA-*`
- **Pull requests** targeting `main` or `dev` branches

#### Jobs

##### Test Job 🧪
**Purpose**: Verify all tests pass on multiple Node versions

- **Runs on**: Ubuntu Latest
- **Node versions tested**: 20.x, 22.x (matrix strategy)
- **Steps**:
  1. Checkout code
  2. Setup Node.js with caching
  3. Install dependencies with `npm ci`
  4. Run linter (if configured)
  5. Run tests with coverage using `npm run test:ci`
  6. Upload coverage reports to Codecov (Node 20.x only)

**What it does**: Runs all 21 Jest tests on both Node.js 20.x (current LTS) and 22.x (latest). This ensures your API works correctly on multiple Node versions, preventing "works on my machine" issues.

**Why it matters**: Catches bugs and breaking changes before they reach production. Running on multiple Node versions ensures compatibility.

##### Build Job 🏗️
**Purpose**: Verify TypeScript compiles successfully

- **Runs on**: Ubuntu Latest
- **Depends on**: Test job must pass
- **Steps**:
  1. Checkout code
  2. Setup Node.js 20.x with caching
  3. Install dependencies with `npm ci`
  4. Build the project with `npm run build`
  5. Verify build output (checks for `dist/` directory and `dist/server.js`)
  6. Upload build artifacts (retained for 7 days)

**What it does**: Compiles TypeScript to JavaScript and verifies the output is valid. Won't run if tests fail (saves compute time).

**Why it matters**: Catches compilation errors before deployment. The uploaded `dist/` artifacts can be downloaded and deployed directly to production servers.

##### Security Audit Job 🔒
**Purpose**: Check for known security vulnerabilities in dependencies

- **Runs on**: Ubuntu Latest
- **Steps**:
  1. Run `npm audit` at moderate level (continues on error)
  2. Run `npm audit` at high level (fails on high/critical vulnerabilities)

**What it does**: Scans all packages in `node_modules` against the npm security advisory database. First check warns about moderate issues; second check fails if critical vulnerabilities are found.

**Why it matters**: Prevents deploying code with known security holes. For example, if `express` has a critical vulnerability allowing remote code execution, this catches it before it reaches production.

##### Type Check Job 📝
**Purpose**: Verify TypeScript types are correct without building

- **Runs on**: Ubuntu Latest
- **Steps**:
  1. Install dependencies
  2. Run TypeScript compiler in check mode (`tsc --noEmit`)

**What it does**: Validates all type annotations are correct without generating output files. Faster than a full build.

**Why it matters**: TypeScript's main benefit is type safety. This ensures you're using types correctly (e.g., not passing a string where a number is expected, or calling methods that don't exist).

##### Code Quality Job 📊
**Purpose**: Report test coverage on pull requests

- **Runs on**: Ubuntu Latest (only on PRs)
- **Depends on**: Test and Build jobs
- **Steps**:
  1. Generate coverage report
  2. Comment on PR with coverage information

**What it does**: Analyzes which lines of code are tested and posts a detailed report as a PR comment showing coverage percentage and changes.

**Why it matters**: Helps reviewers see if new code is properly tested. Encourages maintaining good test coverage (currently at 100% - all 21 tests passing!).

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

## Benefits for Your Team

1. **Catches bugs before merge**: Tests run automatically on every push, no manual testing needed
2. **Consistent quality**: Same checks run for everyone, every time - no shortcuts
3. **Fast feedback**: Know within 2-3 minutes if your code has issues
4. **Multiple Node versions**: Prevents "works on my machine" problems
5. **Security**: Automatically detects vulnerable dependencies before deployment
6. **Documentation**: CI badges show build status at a glance
7. **Parallel execution**: Jobs run simultaneously, saving time
8. **Artifact preservation**: Built code available for 7 days for debugging/deployment

## Status Visibility

You'll see CI/CD status in multiple places:

- **Commits**: Green checkmark ✅ or red X ❌ next to each commit
- **Pull Requests**: Required checks section shows all job statuses
- **Branches**: Branch listing shows pass/fail status
- **Actions Tab**: Detailed logs for every workflow run
- **README Badge**: Shows current build status (optional)

## Branch Protection Rules (Recommended)

Configure these rules in **Settings → Branches** for `main` and `dev`:

1. **Require pull request reviews**: At least 1 approval
2. **Require status checks to pass before merging**:
   - Test (Node 20.x)
   - Test (Node 22.x)
   - Build
   - Security Audit
   - TypeScript Type Check
3. **Require branches to be up to date**: Enabled
4. **Do not allow bypassing**: Enabled for administrators

**Why?** These rules prevent anyone (even admins) from merging code that fails tests or has security issues.

## Workflow Triggers

### Push Triggers
- Pushes to `main` branch
- Pushes to `dev` branch
- Pushes to any branch matching `SPMA-*` pattern (feature branches)

### Pull Request Triggers
- PRs targeting `main` branch
- PRs targeting `dev` branch

**Note**: The `SPMA-*` pattern matches all your feature branches (SPMA-expose-login-endpoint, SPMA-Fix-code-review-findings, etc.)

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
