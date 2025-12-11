# Branch Protection Setup Guide

This guide walks you through setting up GitHub branch protection rules for `main` and `dev` branches.

## 📋 Pre-Setup Checklist

Before configuring branch protection, ensure:

- [ ] You have **admin access** to the repository
- [ ] CI/CD workflow (`.github/workflows/ci.yml`) is committed to the repository
- [ ] At least one CI workflow run has completed successfully (so status checks appear)

**First time?** If the CI workflow hasn't run yet, set up basic protections first, then add status checks after the first workflow run.

## 🎯 Quick Start: 5-Minute Setup

### Option A: First-Time Setup (No CI Runs Yet)

1. Set up basic protections (Steps 1-3 below, skip status checks)
2. Push your code to trigger CI workflow
3. Come back and add status checks (Step 4)

### Option B: Full Setup (CI Already Running)

Follow all steps 1-5 below

## 📖 Detailed Setup Instructions

### Step 1: Navigate to Branch Protection Settings

1. Go to your repository: `https://github.com/taberj-git/soleo-spike-api`
2. Click **Settings** tab (requires admin access)
3. Click **Branches** in the left sidebar (under "Code and automation")
4. Click **Add branch protection rule**

```
Repository → Settings → Branches → Add branch protection rule
```

---

### Step 2: Configure Branch Pattern

**Branch name pattern:** `main`

This rule will apply to your main production branch.

---

### Step 3: Configure Protection Rules

Copy this checklist and check each box in GitHub:

#### ✅ Pull Request Requirements

```
☑ Require a pull request before merging
  ☑ Require approvals
    Number of required approvals: 1
  ☐ Dismiss stale pull request approvals when new commits are pushed (Optional)
  ☐ Require review from Code Owners (Optional - if you have CODEOWNERS file)
  ☐ Restrict who can dismiss pull request reviews (Optional)
  ☐ Allow specified actors to bypass required pull requests (Leave unchecked)
  ☐ Require approval of the most recent reviewable push (Recommended for security)
```

#### ✅ Status Check Requirements

```
☑ Require status checks to pass before merging
  ☑ Require branches to be up to date before merging

  Search for and select these status checks:
    ☑ Test (20.x)
    ☑ Test (22.x)
    ☑ Build
    ☑ Security Audit
    ☑ TypeScript Type Check
```

**⚠️ Important**: Status checks only appear in the search after your first CI workflow run!

**Can't find status checks?**
- Push code to trigger the workflow first
- Wait for it to complete
- Come back and add the checks

#### ✅ Additional Protections

```
☑ Require conversation resolution before merging
  (All PR comments must be resolved before merging)

☑ Require signed commits (Optional - recommended if team uses GPG)

☐ Require linear history (Optional - prevents merge commits, forces squash/rebase)

☑ Require deployments to succeed before merging (Skip - not configured yet)

☐ Lock branch (Leave unchecked - prevents all pushes)

☑ Do not allow bypassing the above settings
  (IMPORTANT: Prevents admins from bypassing protections)

☑ Restrict who can push to matching branches (Optional)
  (Leave empty to allow all repo members via PRs)

☐ Allow force pushes (Leave unchecked - dangerous!)

☐ Allow deletions (Leave unchecked - prevents accidental deletion)
```

---

### Step 4: Save the Rule

Click **Create** at the bottom of the page.

✅ You should see: "Branch protection rule created"

---

### Step 5: Repeat for `dev` Branch

1. Click **Add branch protection rule** again
2. Enter branch pattern: `dev`
3. Apply **same settings** as `main` branch (use checklist above)
4. Click **Create**

---

## 🔍 What Each Setting Does

### Require a Pull Request Before Merging
**What it does**: Prevents direct commits to protected branches. All changes must go through a PR.

**Why it matters**: Ensures code review happens for every change.

### Require Approvals
**What it does**: At least 1 other person must approve the PR before merging.

**Why it matters**: Catches bugs, enforces code quality, shares knowledge.

### Require Status Checks to Pass
**What it does**: All CI jobs (tests, build, security) must succeed before merging.

**Why it matters**: Prevents broken code, failing tests, or security vulnerabilities from reaching main/dev.

### Require Branches to Be Up to Date
**What it does**: PR branch must have latest changes from target branch before merging.

**Why it matters**: Prevents integration issues where tests pass on outdated code but fail on latest.

### Require Conversation Resolution
**What it does**: All PR review comments must be resolved before merging.

**Why it matters**: Ensures feedback is addressed, not ignored.

### Do Not Allow Bypassing
**What it does**: Even repository admins cannot bypass these rules.

**Why it matters**: Maintains consistency - rules apply to everyone, no exceptions.

---

## 📊 Visual Diagram: How Protection Works

```
Developer Workflow with Branch Protection
═══════════════════════════════════════════

1. Developer creates feature branch
   └─ git checkout -b SPMA-new-feature

2. Developer commits changes
   └─ git add . && git commit -m "Add feature"

3. Developer pushes to GitHub
   └─ git push origin SPMA-new-feature

4. CI/CD automatically runs
   ┌─────────────────────────────┐
   │ ✓ Test (20.x)      - 30s    │
   │ ✓ Test (22.x)      - 30s    │
   │ ✓ Build            - 20s    │
   │ ✓ Security Audit   - 15s    │
   │ ✓ Type Check       - 10s    │
   └─────────────────────────────┘

5. Developer creates Pull Request → main
   └─ Click "New Pull Request" on GitHub

6. Protection Rules Activate
   ┌─────────────────────────────────────┐
   │ Merging is blocked                  │
   │                                     │
   │ Required before merge:              │
   │ ☐ 1 approval                        │
   │ ☐ All conversations resolved        │
   │ ☐ Test (20.x) must pass            │
   │ ☐ Test (22.x) must pass            │
   │ ☐ Build must pass                  │
   │ ☐ Security Audit must pass         │
   │ ☐ Type Check must pass             │
   │ ☐ Branch must be up to date        │
   └─────────────────────────────────────┘

7. Team member reviews code
   └─ Adds comments, requests changes

8. Developer addresses feedback
   └─ git commit -m "Address review feedback"
   └─ git push (CI runs again automatically)

9. Reviewer approves
   └─ Click "Approve" button

10. All checks pass
    ┌─────────────────────────────────────┐
    │ Ready to merge                      │
    │                                     │
    │ ✅ 1 approval received              │
    │ ✅ All conversations resolved       │
    │ ✅ Test (20.x) passed              │
    │ ✅ Test (22.x) passed              │
    │ ✅ Build passed                    │
    │ ✅ Security Audit passed           │
    │ ✅ Type Check passed               │
    │ ✅ Branch is up to date            │
    │                                     │
    │ [Merge pull request ▼]             │
    └─────────────────────────────────────┘

11. Code merged to main/dev
    └─ Protected branch updated safely!
```

---

## 🧪 Testing Your Configuration

After setting up branch protection, verify it's working:

### Test 1: Try Direct Push (Should Fail)

```bash
# This should be BLOCKED
git checkout main
git commit -m "test" --allow-empty
git push origin main
```

**Expected result:**
```
remote: error: GH006: Protected branch update failed
remote: error: Cannot push to main branch. Pull requests required.
To github.com:taberj-git/soleo-spike-api.git
 ! [remote rejected] main -> main (protected branch hook declined)
```

✅ If you see this error, protection is working!

### Test 2: Create a Test PR

```bash
# Create a test branch
git checkout -b test-branch-protection
git commit -m "Test branch protection" --allow-empty
git push origin test-branch-protection
```

Then on GitHub:
1. Create a PR from `test-branch-protection` → `main`
2. Verify you see "Merging is blocked"
3. Verify all required checks are listed
4. Wait for CI to run
5. Verify checks change from ⏳ to ✅
6. Verify you still can't merge without approval
7. Close PR (don't merge)
8. Delete test branch

---

## 📝 Status Check Names Reference

After your first CI run, these exact names will appear in the status check search:

| Job Name | Status Check Name | What it tests |
|----------|------------------|---------------|
| Test (Matrix 20.x) | `Test (20.x)` | All Jest tests on Node 20.x |
| Test (Matrix 22.x) | `Test (22.x)` | All Jest tests on Node 22.x |
| Build | `Build` | TypeScript compilation |
| Security Audit | `Security Audit` | npm audit for vulnerabilities |
| Type Check | `TypeScript Type Check` | tsc --noEmit validation |

---

## 🚨 Troubleshooting

### Issue: "I don't see the status checks in the search box"

**Cause**: The CI workflow hasn't run yet, or job names don't match.

**Solution**:
1. Check `.github/workflows/ci.yml` exists
2. Push code to trigger the workflow
3. Go to Actions tab and verify workflow ran successfully
4. Job names in workflow must match exactly (case-sensitive)
5. After successful run, status checks appear in ~5 minutes

### Issue: "I can't push to main even though I'm an admin"

**Cause**: Branch protection is working as designed!

**Solution**: This is correct behavior. Create a PR instead:
```bash
git checkout -b feature-branch
# make changes
git push origin feature-branch
# Create PR on GitHub
```

### Issue: "Status checks show 'Expected — Waiting for status to be reported'"

**Cause**: Status check name doesn't match any job in the workflow, or workflow hasn't run on this PR yet.

**Solution**:
1. Push a commit to the PR branch to trigger CI
2. Verify job names match exactly
3. Check Actions tab for workflow run status

### Issue: "The 'Merge pull request' button is disabled"

**Cause**: One or more protection requirements aren't met.

**Solution**: Check the PR page for which requirements are missing:
- Need more approvals?
- Need to resolve comments?
- Are any status checks failing or pending?
- Is branch out of date?

---

## ✅ Post-Setup Checklist

After configuring branch protection:

- [ ] Direct push to `main` is blocked
- [ ] Direct push to `dev` is blocked
- [ ] Created a test PR successfully
- [ ] Verified "Merging is blocked" message appears
- [ ] Verified all 5 status checks are listed as required
- [ ] CI workflow runs automatically on PR
- [ ] Status checks appear and pass
- [ ] Cannot merge without approval
- [ ] All protections working as expected
- [ ] Deleted test branch and PR
- [ ] Documented any custom settings in team wiki

---

## 📚 Additional Resources

- [GitHub Branch Protection Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [GitHub Actions Status Checks](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories-with-code-quality-features/about-status-checks)
- [Repository Settings Best Practices](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features)

---

## 🎓 Training for Team Members

Share this with your team:

### For New Team Members

**Old way** (Direct push - now blocked):
```bash
git checkout main
git add .
git commit -m "changes"
git push  # ❌ This will fail!
```

**New way** (PR workflow - required):
```bash
git checkout -b SPMA-my-feature
git add .
git commit -m "Add new feature"
git push origin SPMA-my-feature
# Then create PR on GitHub
```

### Key Points to Remember

1. **Never push directly to `main` or `dev`** - Always use PRs
2. **All PRs need approval** - Ask a team member to review
3. **All tests must pass** - CI runs automatically, wait for ✅
4. **Resolve all comments** - Address feedback before merging
5. **Keep branch updated** - Merge latest changes from target branch
6. **Don't bypass protections** - They're there for everyone's benefit

---

## 🔄 Updating Protection Rules

To modify existing rules:

1. Go to **Settings** → **Branches**
2. Find the rule (e.g., `main`)
3. Click **Edit** (not Delete)
4. Make changes
5. Scroll down and click **Save changes**

**Warning**: Changes take effect immediately for all PRs!

---

**Last Updated**: 2025-12-10
**Maintainer**: Infrastructure Team
**Questions?**: Open an issue or ask in #dev-ops channel
