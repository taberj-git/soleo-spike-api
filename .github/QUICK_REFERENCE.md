# Quick Reference: Branch Protection & CI/CD

Quick reference card for developers working with protected branches and CI/CD.

---

## 🚀 Quick Start: Making Changes

### The Correct Workflow

```bash
# 1. Create feature branch
git checkout main
git pull origin main
git checkout -b SPMA-my-feature

# 2. Make your changes
# ... edit files ...

# 3. Commit changes
git add .
git commit -m "Descriptive commit message"

# 4. Push to GitHub
git push origin SPMA-my-feature

# 5. Create Pull Request on GitHub
# Go to repository → Click "Compare & pull request"

# 6. Wait for CI checks to pass (2-3 minutes)

# 7. Request review from team member

# 8. Address feedback if needed
git add .
git commit -m "Address review comments"
git push origin SPMA-my-feature

# 9. After approval + green checks → Merge on GitHub

# 10. Clean up
git checkout main
git pull origin main
git branch -d SPMA-my-feature
```

---

## ✅ CI/CD Checks (Must All Pass)

| Check | Time | What It Does |
|-------|------|--------------|
| ✓ Test (20.x) | ~30s | Run all 21 tests on Node 20.x |
| ✓ Test (22.x) | ~30s | Run all 21 tests on Node 22.x |
| ✓ Build | ~20s | Compile TypeScript → JavaScript |
| ✓ Security Audit | ~15s | Check for vulnerable packages |
| ✓ Type Check | ~10s | Validate TypeScript types |

**Total time**: ~2-3 minutes

---

## 🛑 Common Mistakes & Solutions

### ❌ Mistake: Pushing directly to main

```bash
git push origin main
```

**Error**: `remote: error: GH006: Protected branch update failed`

**✅ Solution**: Use feature branch + PR workflow (see above)

---

### ❌ Mistake: Forcing push to main

```bash
git push -f origin main
```

**Error**: `Force pushes are disabled`

**✅ Solution**: Never force push to protected branches. Use PRs.

---

### ❌ Mistake: Merging without approval

**Error**: Merge button is disabled

**✅ Solution**: Request review from team member, wait for approval

---

### ❌ Mistake: Merging with failing tests

**Error**: `Required status checks must pass`

**✅ Solution**: Fix the tests locally, commit, push. CI runs automatically.

---

## 📋 PR Checklist

Before creating a PR, ensure:

- [ ] Branch is up to date with target (`git pull origin main`)
- [ ] All tests pass locally (`npm test`)
- [ ] Build succeeds locally (`npm run build`)
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] Commit messages are descriptive
- [ ] Changes are focused (one feature/fix per PR)

After creating PR:

- [ ] All CI checks are passing (✅ green)
- [ ] Requested review from appropriate team member
- [ ] Added description explaining changes
- [ ] Linked related issues (if any)
- [ ] Addressed all review comments
- [ ] Resolved all conversations

---

## 🔧 Local Testing Commands

Run these **before** pushing:

```bash
# Install dependencies
npm ci

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Build project
npm run build

# Check TypeScript types
npx tsc --noEmit

# Security audit
npm audit

# Run linter (if configured)
npm run lint
```

---

## 🎯 Branch Naming Convention

Use format: `SPMA-{description}`

**Good examples:**
- `SPMA-fix-login-bug`
- `SPMA-add-user-validation`
- `SPMA-update-dependencies`

**Bad examples:**
- `fix` (not descriptive)
- `johns-branch` (use feature description)
- `main-backup` (confusing)

---

## 🚨 When CI Fails

### Test Failures

**What to do:**
1. Click on failed check in PR
2. View logs to see which test failed
3. Fix the test locally
4. Run `npm test` to verify
5. Commit and push fix

### Build Failures

**What to do:**
1. Check build logs for TypeScript errors
2. Run `npm run build` locally
3. Fix compilation errors
4. Run `npx tsc --noEmit` to verify
5. Commit and push fix

### Security Audit Failures

**What to do:**
1. Run `npm audit` locally to see vulnerabilities
2. Run `npm audit fix` to auto-fix
3. If manual fix needed, update specific package
4. Commit updated `package-lock.json`
5. Push changes

---

## 💡 Tips & Best Practices

### 1. Keep PRs Small
- Easier to review
- Faster to merge
- Less likely to have conflicts

### 2. Write Good Commit Messages
```bash
# ❌ Bad
git commit -m "fix"

# ✅ Good
git commit -m "Fix login validation to prevent empty passwords"
```

### 3. Pull Often
```bash
# Start of day
git checkout main
git pull origin main

# Before creating PR
git checkout main
git pull origin main
git checkout SPMA-my-feature
git merge main  # or git rebase main
```

### 4. Test Locally First
- Saves CI compute time
- Faster feedback
- Catches issues early

### 5. Respond to Reviews Quickly
- Keeps PR fresh in reviewer's mind
- Avoids merge conflicts
- Moves code to production faster

---

## 📞 Getting Help

### CI/CD Issues
- Check `.github/workflows/README.md` for detailed docs
- Check Actions tab for detailed logs
- Ask in #dev-ops channel

### Branch Protection Issues
- Check `.github/BRANCH_PROTECTION_SETUP.md` for setup guide
- Ask repository admin
- Create issue with "infrastructure" label

### General Questions
- Check project documentation in `/docs`
- Ask in team chat
- Create issue for clarification

---

## 📊 CI/CD Status Indicators

| Symbol | Meaning | Action |
|--------|---------|--------|
| ⏳ | Running/Pending | Wait for completion |
| ✅ | Passed | Good to go! |
| ❌ | Failed | Click to view logs, fix issue |
| ⚠️ | Warning | Review logs, may need fixing |
| ⏸️ | Blocked | Waiting on dependencies |

---

## 🔗 Quick Links

- **Repository**: https://github.com/taberj-git/soleo-spike-api
- **Actions**: https://github.com/taberj-git/soleo-spike-api/actions
- **Settings**: https://github.com/taberj-git/soleo-spike-api/settings
- **Pull Requests**: https://github.com/taberj-git/soleo-spike-api/pulls

---

**Print this page** or **bookmark it** for quick reference!

**Last Updated**: 2025-12-10
