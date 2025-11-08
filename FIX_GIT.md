# Fix Git Push Error - Remove node_modules from Git

## Problem
GitHub rejected your push because `node_modules` contains files larger than 100MB. `node_modules` should never be committed to Git.

## Solution

### Step 1: Remove node_modules from Git tracking

Run these commands in your terminal from the `performance-dashboard` directory:

```bash
# Remove node_modules from Git index (but keep the folder locally)
git rm -r --cached node_modules

# Remove .next folder if it exists
git rm -r --cached .next 2>/dev/null || true

# Stage the .gitignore file
git add .gitignore

# Commit the changes
git commit -m "Remove node_modules and add .gitignore"
```

### Step 2: If node_modules is already in Git history

If `node_modules` was already pushed to a previous commit, you need to remove it from Git history:

```bash
# Remove from entire Git history (use with caution!)
git filter-branch --force --index-filter \
  "git rm -rf --cached --ignore-unmatch node_modules" \
  --prune-empty --tag-name-filter cat -- --all

# Or use the newer git-filter-repo (recommended)
# First install: pip install git-filter-repo
# Then run:
git filter-repo --path node_modules --invert-paths
```

### Step 3: Force push (only if you removed from history)

⚠️ **Warning**: Only do this if you're sure no one else has pulled your changes!

```bash
git push origin main --force
```

### Alternative: Start Fresh (if you haven't pushed much)

If you haven't pushed much yet, you can start with a fresh commit:

```bash
# Remove the remote
git remote remove origin

# Remove all files from Git (but keep them locally)
git rm -rf --cached .

# Add everything back (now respecting .gitignore)
git add .

# Commit
git commit -m "Initial commit - exclude node_modules"

# Add remote back
git remote add origin https://github.com/vvignesh04/flam.git

# Push
git push -u origin main
```

## Verify

After fixing, verify that `node_modules` is not tracked:

```bash
git ls-files | grep node_modules
```

This should return nothing. If it shows files, they're still being tracked.

## Best Practices

1. **Always commit `.gitignore` first** before adding other files
2. **Never commit**:
   - `node_modules/`
   - `.next/`
   - `.env` files
   - Build artifacts
3. **Use `npm install`** to restore `node_modules` on other machines

