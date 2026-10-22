---
sidebar_position: 7.5
sidebar_label: "Working with Agents"
---

# Working with Agents

> How an AI agent links a project's work and reports on it. The project links are part of every setup; the status circles are optional, chosen during [Setup](/docs/Guides/setup#working-with-the-agent). Both work the same with Claude Code, ChatGPT, Codex or any agent that reads `AGENTS.md`.

Whatever the project chooses is written into the **Project workflow** section of its `AGENTS.md`, from the [template](/docs/templates#agents), so every agent in the project follows it.

## Project links

Every project records these two links in **Project workflow**. An agent uses them to link tickets and Pull Requests, and to know where work belongs.

| Link           | Where it comes from                                                                                                                                                                                                        |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GitHub repo    | Read it from `git remote get-url origin` and confirm it with the person. If there is no remote, ask                                                                                                                        |
| Linear project | If the project's own docs already name it, read it from there and confirm it with the person. Otherwise ask. Write the workspace, the project and the ticket prefix, such as `activatus-life`, Launchpad, `ACT`, or "None" |

**Never copy a Linear workspace or ticket prefix from another project.** Projects under the same organisation often live in different Linear workspaces or projects, and a guessed prefix files tickets in the wrong place. If `AGENTS.md` does not name the Linear project, ask before creating, linking or citing any ticket.

## Status circles

Optional. An agent reports the state of every ticket or piece of work as one line: a status circle, the ticket ID as a link, a short title and, where there is one, its Pull Request as a link. The colour alone tells the person whether they need to act.

| Circle | Means                                                                                                                          |
| ------ | ------------------------------------------------------------------------------------------------------------------------------ |
| ✅     | Merged, In UAT or Done. Nothing to do                                                                                          |
| 🟢     | Pull Request ready for the person to review and merge. The link is the Pull Request                                            |
| 🟣     | Working on it                                                                                                                  |
| 🟡     | Ready to commit: done, checked, left uncommitted. Say the branch and where it is. The person commits it, or tells the agent to |
| 🟠     | Waiting on another ticket or Pull Request first. Say which                                                                     |
| 🔴     | Blocked, or the person has to do something. Say what, in a few words                                                           |
| ⚪     | Not started (Backlog or Todo)                                                                                                  |

```md title="One line per piece of work"
🟢 [ABC-12](https://linear.app/<workspace>/issue/ABC-12) Short title: [#19](https://github.com/<organisation>/<repo>/pull/19)
```

- **Every ticket ID is a link to its ticket, and every Pull Request number is a link to the Pull Request.** Build them from the project links above.
- **No ticket is fine.** Work without one is just the circle and a short title.
- **Only what the person needs.** Leave out anything they already know.

Whether and when agents commit is not part of this. It is the project's own workflow, under **Who commits** in Project workflow.
