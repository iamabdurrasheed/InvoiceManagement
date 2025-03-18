
```md
# Git Workflow for Pushing to Gitea

## Step 1: Initialize a Git Repository (if not already initialized)
```sh
git init
```
**Output:**
```
Initialized empty Git repository in <your_directory>/.git/
```

## Step 2: Ensure the Branch is Set to `main`
```sh
git branch -M main
```
**(No output if successful)**

## Step 3: Check if a Remote Already Exists (Optional)
```sh
git remote -v
```
**Output Example (if a remote exists):**
```
origin  https://gitea.example.com/user/repo.git (fetch)
origin  https://gitea.example.com/user/repo.git (push)
```

## Step 4: Remove the Existing Remote (If Needed)
```sh
git remote remove origin
```
**(No output if successful, error if no remote exists)**

## Step 5: Add the Gitea Repository as the New Remote
```sh
git remote add origin <GITEA_REPO_URL>
```
**(No output if successful)**

## Step 6: Fetch and Rebase to Avoid Conflicts
```sh
git pull --rebase origin main
```
**Possible Outputs:**
- If successful:
  ```
  Successfully rebased and updated refs/heads/main.
  ```
- If conflicts occur:
  ```
  CONFLICT (content): Merge conflict in <filename>
  ```

## Step 7: Stage All Changes
```sh
git add .
```
**(No output if successful)**

## Step 8: Commit Changes with a Meaningful Message
```sh
git commit -m "Added interview assignment"
```
**Output Example:**
```
[main 123abc4] Added interview assignment
 3 files changed, 15 insertions(+), 2 deletions(-)
```

## Step 9: Push the Changes to the Gitea Repository
```sh
git push -u origin main
```
**Output Example:**
```
Enumerating objects: 5, done.
Counting objects: 100% (5/5), done.
Writing objects: 100% (5/5), 1.23 KiB | 1.23 MiB/s, done.
To https://gitea.example.com/user/repo.git
 * [new branch]      main -> main
```

---

# Handling Conflicts

If conflicts occur in **Step 6**, use the following alternative steps:

## Step 1: Initialize and Set the Branch
```sh
git init
git branch -M main
```

## Step 2: Remove Existing Remote (If Exists)
```sh
git remote remove origin 2>/dev/null  # Removes remote (ignores errors if not present)
```

## Step 3: Add the Gitea Repository Again
```sh
git remote add origin <GITEA_REPO_URL>
```

## Step 4: Fetch Remote Changes Before Rebasing
```sh
git fetch origin main
```

## Step 5: Attempt to Rebase or Abort if Needed
```sh
git pull --rebase origin main || git rebase --abort
```
**If rebase fails due to conflicts:**
- Manually resolve conflicts in the affected files.
- After resolving, run:
  ```sh
  git add .
  git rebase --continue
  ```
- If rebase becomes too complex, abort with:
  ```sh
  git rebase --abort
  ```

## Step 6: Stage, Commit, and Push
```sh
git add .
git commit -m "Resolved conflicts and added interview assignment"
git push -u origin main
```
```