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
indent_style = space
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false
max_line_length = off

[*.{yml,yaml}]
indent_size = 2

[*.json]
indent_size = 2

[Makefile]
indent_style = tab

[*.go]
indent_style = tab

[*.py]
indent_size = 4
```

No package installation required — EditorConfig is a file-based standard.

## Rule reference

| Rule | Value | Rationale |
| --- | --- | --- |
| `charset` | `utf-8` | Universal default; avoids encoding issues on cross-platform teams |
| `end_of_line` | `lf` | Unix line endings everywhere; Windows devs should set `core.autocrlf = input` in git |
| `indent_size` | `2` | Standard for JS/TS/JSON/YAML; overridden for Python (`4`) and tab-based languages |
| `indent_style` | `space` | Consistent rendering across editors; tab width is a display preference that breaks alignment |
| `insert_final_newline` | `true` | POSIX standard; avoids noisy diffs when appending to files |
| `trim_trailing_whitespace` | `true` | Prevents invisible diff noise; **disabled for Markdown** where trailing spaces are significant |

## Markdown exception

In Markdown, two trailing spaces before a newline produce a `<br>` (hard line break). Trimming trailing whitespace would silently corrupt Markdown documents, so `trim_trailing_whitespace = false` is set for `*.md` files.

## Go & Makefile exception

Both Go source files (enforced by `gofmt`) and Makefiles **require** tab indentation. The config sets `indent_style = tab` for these file types to stay consistent with their tooling.

## Alignment with other tools

The EditorConfig settings deliberately mirror the Prettier config:

- `indent_size: 2` ↔ `tabWidth: 2`
- `end_of_line: lf` ↔ `endOfLine: "lf"`

This means the editor writes the right whitespace from the start, and Prettier never has to fix it.
