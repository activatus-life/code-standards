---
name: securityAudit
description: Audit the code for common security problems
argument-hint: "[path]"
allowed-tools: Read, Glob, Grep, Bash(pnpm audit:*), Bash(git ls-files:*)
---

Audit the code for security problems and report them. Do NOT modify any files.

1. Work out the scope: `$ARGUMENTS` if given, otherwise the whole repository.
2. Run `pnpm audit` and note every high and critical vulnerability.
3. Check the code for each of these:
   - **Secrets** — API keys, tokens or passwords written in code or committed in `.env` files. Use `git ls-files` to check which files are tracked.
   - **Access control** — API routes and server actions that do not check who the user is or what they are allowed to do
   - **Input validation** — request data used without being validated
   - **Injection** — database queries or shell commands built by joining strings
   - **Cross-site scripting** — `dangerouslySetInnerHTML` or unescaped user content
   - **Sensitive data** — personal data or secrets written to logs or returned in error messages
   - **Client exposure** — secrets or server-only code reachable from a client component
4. Report the findings in order of severity: **Critical**, **High**, **Medium**, **Low**. For each one give the file and line, what the risk is, and how to fix it.
5. Finish by listing what you did NOT check, so a clean report is not mistaken for a full security review.

If `pnpm audit` fails, say so and carry on with the code checks.

Do NOT audit the source of packages in `node_modules/` or `vendor/` — `pnpm audit` covers dependencies.
Do NOT print the value of any secret you find. Report the file and line only.
Do NOT fix anything. Report only.
Do NOT stage, commit or push.
