# Auto-merge Workflows Guide

This repository includes automated workflows to streamline merging between branches while maintaining branch protection rules.

## Overview

Two workflows automate the promotion pipeline:

1. **Auto-merge to Dev** - Automatically merges PRs to `dev` when conditions are met
2. **Auto-promote to Main** - Creates PRs to promote `dev` to `main`

## Workflow 1: Auto-merge to Dev

**File:** `.github/workflows/auto-merge-to-dev.yml`

### How It Works

This workflow automatically merges feature branch PRs into `dev` when:
1. ✅ All CI/CD checks pass (tests, build, security audit, type-check)
2. ✅ PR has the `auto-merge` label
3. ✅ PR is not a draft

### Usage

#### Step 1: Create a PR to dev

```bash
# Push your feature branch
git push origin SPMA-your-feature-name

# Create PR via GitHub UI or gh CLI
gh pr create --base dev --title "Your feature" --body "Description"
```

#### Step 2: Add the auto-merge label

```bash
# Via gh CLI
gh pr edit <PR_NUMBER> --add-label "auto-merge"

# Or via GitHub UI:
# 1. Open your PR
# 2. Click "Labels" on the right sidebar
# 3. Add "auto-merge" label
```

#### Step 3: Wait for automation

The workflow will:
1. Monitor the PR for status changes
2. Check if all CI/CD checks pass
3. Automatically merge when ready
4. Comment on the PR confirming the merge

### Triggering Events

The workflow runs when:
- PR is labeled/unlabeled
- PR is opened, edited, or synchronized
- CI/CD checks complete
- Reviews are submitted

### Configuration Options

**Require Approval (Line 48):**
```javascript
const isReady = allChecksPassed && (hasApproval || true);
```

- Current: `|| true` allows merge without approval (solo developer mode)
- Change to: `&& hasApproval` to require approval before merge

**Merge Method (Line 93):**
```javascript
merge_method: 'merge', // or 'squash' or 'rebase'
```

Options:
- `merge` - Create merge commit (default, preserves full history)
- `squash` - Squash all commits into one
- `rebase` - Rebase and fast-forward

## Workflow 2: Auto-promote Dev to Main

**File:** `.github/workflows/auto-promote-to-main.yml`

### How It Works

This workflow creates a PR from `dev` to `main` to promote stable changes to production.

### Triggering Options

#### Option 1: Manual Trigger (Recommended)

Run manually when ready to promote:

```bash
# Via gh CLI
gh workflow run "Auto-promote Dev to Main" -f reason="Release v1.2.0"

# Or via GitHub UI:
# 1. Go to Actions tab
# 2. Select "Auto-promote Dev to Main"
# 3. Click "Run workflow"
# 4. Enter reason (optional)
# 5. Click "Run workflow"
```

#### Option 2: Scheduled (Currently Enabled)

Automatically runs every Sunday at midnight UTC:

```yaml
schedule:
  - cron: '0 0 * * 0'  # Every Sunday at midnight
```

Common cron schedules:
- `0 0 * * 1` - Every Monday at midnight
- `0 0 1 * *` - First day of every month
- `0 0 * * 1,5` - Every Monday and Friday

**To disable:** Comment out the `schedule:` section in the workflow file.

#### Option 3: Tag-based (Disabled by Default)

Trigger when you create a release tag:

```yaml
# Uncomment in workflow file:
push:
  tags:
    - 'v*.*.*'
```

Then create tags:
```bash
git tag v1.0.0
git push origin v1.0.0
```

### What Happens

1. Workflow checks if `dev` is ahead of `main`
2. If yes, creates (or updates) a PR from `dev` to `main`
3. PR includes:
   - List of all commits to be merged
   - Summary of changes
   - Reason for promotion
4. You can then:
   - Review the PR
   - Add `auto-merge` label for automatic merge
   - Or merge manually

### PR Auto-merge for Main

After the PR is created, you can auto-merge it:

```bash
# Add auto-merge label
gh pr edit <PR_NUMBER> --add-label "auto-merge"
```

The auto-merge workflow will then merge it after CI/CD passes.

## Branch Protection Compatibility

These workflows work with GitHub branch protection rules:

### Required Settings

Both `dev` and `main` branches should have:

✅ **Require a pull request before merging**
- Required (workflows create PRs)

✅ **Require status checks to pass before merging**
- Test (Node 20.x)
- Test (Node 22.x)
- Build
- Security Audit
- TypeScript Type Check

❌ **Require approvals** (optional for solo projects)
- Set to 0 approvals if working solo
- Or use `hasApproval || true` in workflow

✅ **Allow auto-merge**
- Must be enabled for workflows to auto-merge

✅ **Do not allow bypassing the above settings**
- Keep enabled for production branches

### GitHub Actions Permissions

The workflows require these permissions (already configured):

```yaml
permissions:
  contents: write        # To merge PRs
  pull-requests: write   # To create/update PRs
  checks: read           # To check CI/CD status
```

## Labels

Create these labels in your repository:

### auto-merge
- **Color:** `#0E8A16` (green)
- **Description:** "Automatically merge this PR when checks pass"

### auto-promote
- **Color:** `#1D76DB` (blue)
- **Description:** "Ready to promote to production"

Create via GitHub UI or CLI:
```bash
gh label create "auto-merge" --color "0E8A16" --description "Automatically merge when checks pass"
gh label create "auto-promote" --color "1D76DB" --description "Ready to promote to production"
```

## Example Workflows

### Scenario 1: Feature Development (Solo Developer)

```bash
# 1. Create feature branch
git checkout -b SPMA-new-feature

# 2. Make changes and commit
git add .
git commit -m "Add new feature"

# 3. Push and create PR
git push origin SPMA-new-feature
gh pr create --base dev --title "New feature" --body "Description"

# 4. Add auto-merge label
gh pr edit <PR_NUMBER> --add-label "auto-merge"

# 5. Wait - workflow will auto-merge when CI passes
```

### Scenario 2: Promoting to Production

```bash
# Option A: Manual trigger
gh workflow run "Auto-promote Dev to Main" -f reason="Release v1.2.0 - Bug fixes"

# Option B: Let schedule run automatically (if enabled)
# (Runs every Sunday at midnight)

# Then, when PR is created:
gh pr edit <PR_NUMBER> --add-label "auto-merge"

# Or merge manually after review:
gh pr merge <PR_NUMBER>
```

### Scenario 3: Team Environment

```bash
# 1. Create and push feature
git push origin SPMA-team-feature
gh pr create --base dev

# 2. Don't add auto-merge label yet
# 3. Request review from teammate
gh pr review <PR_NUMBER> --request-review @teammate

# 4. After approval, add label
gh pr edit <PR_NUMBER> --add-label "auto-merge"

# 5. Workflow auto-merges
```

## Monitoring

### View Workflow Runs

```bash
# List recent workflow runs
gh run list --workflow=auto-merge-to-dev.yml

# View specific run
gh run view <RUN_ID>

# View logs
gh run view <RUN_ID> --log
```

### Notifications

Workflows will comment on PRs:
- ✅ "This PR has been automatically merged to dev"
- ⚠️ "Auto-merge failed: [reason]"

## Troubleshooting

### Auto-merge not triggering

**Check:**
1. Does PR have `auto-merge` label?
2. Are all CI/CD checks passing?
3. Is PR in draft mode?
4. Check workflow logs: `gh run list --workflow=auto-merge-to-dev.yml`

### Permissions errors

**Fix:**
1. Go to Settings → Actions → General
2. Workflow permissions: Select "Read and write permissions"
3. Enable "Allow GitHub Actions to create and approve pull requests"

### Branch protection blocking merge

**Fix:**
1. Ensure "Allow auto-merge" is enabled in branch protection
2. Check that status checks are configured correctly
3. Verify workflow has `contents: write` permission

### Schedule not running

**Note:** GitHub Actions schedules can be delayed or skipped if:
- Repository has low activity
- GitHub is experiencing high load

**Solution:** Use manual triggers or webhook triggers instead.

## Security Considerations

### Token Security

- Workflows use `GITHUB_TOKEN` (automatically provided)
- Token permissions are scoped to minimum required
- No secrets need to be configured

### Branch Protection

- Workflows respect branch protection rules
- Cannot bypass required status checks
- Cannot force push to protected branches

### Review Process

For production deployments:
1. Consider requiring manual approval for main
2. Use manual trigger instead of schedule
3. Add additional checks in workflow (e.g., version bump verification)

## Disabling Workflows

### Temporarily disable

```bash
# Disable workflow
gh workflow disable "Auto-merge to Dev"
gh workflow disable "Auto-promote Dev to Main"

# Re-enable
gh workflow enable "Auto-merge to Dev"
```

### Permanently disable

Delete or rename the workflow files:
```bash
mv .github/workflows/auto-merge-to-dev.yml .github/workflows/auto-merge-to-dev.yml.disabled
```

## Customization

### Change merge strategy for dev

Edit `auto-merge-to-dev.yml` line 93:
```javascript
merge_method: 'squash', // Clean up commit history
```

### Require approval

Edit `auto-merge-to-dev.yml` line 48:
```javascript
const isReady = allChecksPassed && hasApproval; // Remove "|| true"
```

### Change schedule

Edit `auto-promote-to-main.yml` schedule:
```yaml
schedule:
  - cron: '0 0 1 * *'  # First day of month
```

### Add notifications

Add Slack/Discord notifications:
```yaml
- name: Notify team
  if: success()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'PR merged to dev!'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## Migration from Manual Process

### Before (Manual)

```bash
# Create PR
gh pr create --base dev

# Wait for checks
# Manually click "Merge" button in GitHub UI

# Create promotion PR
gh pr create --base main --head dev

# Wait for checks
# Manually merge again
```

### After (Automated)

```bash
# Create PR with auto-merge label
gh pr create --base dev
gh pr edit <PR> --add-label "auto-merge"

# That's it! Automation handles:
# - Waiting for CI
# - Merging to dev
# - Creating promotion PRs (on schedule or manual trigger)
# - Merging to main (with auto-merge label)
```

## Best Practices

1. **Always use auto-merge label** - Don't bypass the automation
2. **Monitor CI/CD failures** - Fix broken tests immediately
3. **Review promotion PRs** - Even with automation, check what's going to main
4. **Use semantic commit messages** - They appear in promotion PRs
5. **Tag releases** - After merging to main, tag the release
6. **Keep dev stable** - Only merge tested features

## Support

For issues with workflows:
1. Check workflow logs: Actions tab → Select workflow → View logs
2. Verify branch protection settings
3. Ensure labels exist
4. Check GitHub Actions permissions
