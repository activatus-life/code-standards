---
name: updateLayout
description: Regenerate the repository layout in AGENTS.md
allowed-tools: Read, Glob, Edit, Bash(tree:*), Bash(ls:*)
---

Update the "Repository layout" section of `AGENTS.md` so it matches the repository as it is now.

1. Read `AGENTS.md` and find the "Repository layout" section.
2. Build a directory tree two levels deep:
   - Run `tree -L 2 -a -I 'node_modules|.git|.next|build|dist|coverage|.DS_Store'`
   - If `tree` is not installed, build the same tree with `ls` and Glob, and say that you used the fallback.
3. Replace the code block in the "Repository layout" section with the new tree.
4. If `AGENTS.md` has a "Workspace packages" section, update its table from the workspace `package.json` files: package name, path and description.
5. Report what changed: the folders that were added and removed.

If `AGENTS.md` does not exist, or has no "Repository layout" section, stop and say so.

Do NOT edit any other section of `AGENTS.md`, and do NOT edit any other file.
Do NOT stage, commit or push. Leave the change uncommitted.
