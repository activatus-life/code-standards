---
sidebar_position: 3
---

# EditorConfig

EditorConfig enforces whitespace conventions at the editor level, before any linter or formatter runs. It works across all editors and IDEs without extra plugins (VS Code, JetBrains, Vim, Neovim, etc. all support it natively or via a free extension).

## Setup

Copy this file to your project root as `.editorconfig`:

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
indent_size = 2
indent_style = tab
insert_final_newline = true
trim_trailing_whitespace = true

# Markdown reads a tab as four spaces, so it uses spaces.
[*.{md,mdx}]
indent_style = space
trim_trailing_whitespace = false
max_line_length = off

# YAML does not allow tabs.
[*.{yml,yaml}]
indent_style = space
indent_size = 2

# Python's own style guide uses 4 spaces.
[*.py]
indent_style = space
indent_size = 4
```

No package installation required — EditorConfig is a file-based standard.

## Rule reference

| Rule                       | Value   | Rationale                                                                                                                         |
| -------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `charset`                  | `utf-8` | Universal default; avoids encoding issues on cross-platform teams                                                                 |
| `end_of_line`              | `lf`    | Unix line endings everywhere; Windows devs should set `core.autocrlf = input` in git                                              |
| `indent_size`              | `2`     | How wide a tab shows, and the indent for files that use spaces. Python uses `4`                                                   |
| `indent_style`             | `tab`   | Tabs indent code. Each person sees the indent at the width they like, and files are smaller. Markdown, YAML and Python use spaces |
| `insert_final_newline`     | `true`  | POSIX standard; avoids noisy diffs when appending to files                                                                        |
| `trim_trailing_whitespace` | `true`  | Prevents invisible diff noise; **disabled for Markdown** where trailing spaces are significant                                    |

## Markdown exception

In Markdown, two trailing spaces before a newline produce a `<br>` (hard line break). Trimming trailing whitespace would silently corrupt Markdown documents, so `trim_trailing_whitespace = false` is set for `*.md` files.

## Files that use spaces

| Files                      | Why                                                               |
| -------------------------- | ----------------------------------------------------------------- |
| Markdown (`*.md`, `*.mdx`) | Markdown reads a tab as four spaces, which can break nested lists |
| YAML (`*.yml`, `*.yaml`)   | YAML does not allow tabs                                          |
| Python (`*.py`)            | Python's own style guide uses 4 spaces                            |

## Alignment with other tools

The EditorConfig settings deliberately mirror the Prettier config:

- `indent_style: tab` ↔ `useTabs: true`
- `indent_size: 2` ↔ `tabWidth: 2`
- `end_of_line: lf` ↔ `endOfLine: "lf"`

This means the editor writes the right whitespace from the start, and Prettier never has to fix it.
