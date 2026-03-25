# Obsidian Kanban Sprint

A lightweight weekly planner built entirely in [Obsidian](https://obsidian.md). Organize any area of your life — work, learning, personal projects, health, or anything else — using two Kanban boards: a permanent **Backlog** and a **Weekly Board** created fresh each week. The included example is tailored for software engineering and cybersecurity, but the framework adapts to any domain.


![Backlog Board](assets/screenshots/backlog-overview.png)

---

## Features

- Drag-and-drop task management with the Obsidian Kanban plugin
- Permanent backlog organized by domain and project
- Weekly board with one lane per weekday for daily scheduling
- Color-coded domain tags for instant visual context
- Professional styling via a custom CSS snippet (Nunito font, card accents, shadows)
- One-click weekly board generation with Templater

---

## Prerequisites

1. Install [Obsidian](https://obsidian.md) (v1.5+).
2. Go to `Settings → Community plugins → Browse` and install:

| Plugin | Purpose |
|--------|---------|
| [Templater](https://github.com/SilentVoid13/Templater) | Auto-generates and renames weekly board files |
| [Kanban](https://github.com/mgmeyers/obsidian-kanban) | Renders drag-and-drop boards |

3. Enable both plugins.

---

## Quick Start

1. **Clone or download** this repository and open the folder as an Obsidian vault (`Open folder as vault`).

2. **Configure Templater:**
   `Settings → Templater → Template folder location` → set to `_templates`.

3. **Enable the CSS snippet:**
   `Settings → Appearance → CSS snippets` → toggle on **kanban-professional**.

4. **Open `Backlog.md`** and populate it with your tasks.

5. **Create your first weekly board:**
   Press `Ctrl+P` → `Templater: Create new note from template` → select `Weekly-Kanban-Template`.
   The file is auto-named `Weekly-Kanban-YYYY-Www.md` with all dates filled in.

6. **Pull tasks into the week:**
   Open `Backlog.md` and the weekly board **side by side** (drag the tab to split the view), then drag tasks into the **📋 To Do** lane.

---

## File Structure

```
obsidian-kanban-sprint/
├── .obsidian/snippets/
│   └── kanban-professional.css     # Visual styling — Nunito font, card accents, shadows
├── _templates/
│   └── Weekly-Kanban-Template.md   # Source template for each new weekly board
├── Backlog.md                       # Permanent task pool — never deleted
├── Weekly-Kanban-YYYY-Www.md        # Example weekly board
├── LICENSE
└── README.md
```

---

## Weekly Workflow

### Saturday — Week Setup (~10 min)

1. Create the new weekly board from the template.
2. Open `Backlog.md` and the weekly board **side by side**.
3. Drag the tasks you commit to this week into **📋 To Do**.

![Weekly Board](assets/screenshots/weekly-board-overview.png)

### Daily (~5 min)

- Drag a task from **📋 To Do** into today's weekday lane (e.g. **▸ Mon · 23 Mar**).
- When finished, drag it to **✅ Done**.
- If blocked, drag it to **🧐 Blocked** and add a card note explaining why.

### Friday — Carry-Over (~5 min)

1. Create next week's board.
2. Open both boards **side by side**.
3. Drag remaining To Do and in-progress tasks to next week's **📋 To Do**.
4. Tasks no longer relevant go back to `Backlog.md`.

---

## Managing the Backlog

**Add a task** — write it directly in the relevant lane:
```
- [ ] #dev/backend 🔴 Implement caching layer for API responses
```

**Add a new project lane** — add a `## Heading` in `Backlog.md`:
```
## Cloud Security
- [ ] #security/cloud 🟡 Audit IAM policies for least privilege
```

**Add a new domain** — add a `## Lane` section and register its tag color in the `%% kanban:settings %%` block at the bottom of the file.

---

## Domain Tags & Colors

| Tag | Domain | Color |
|-----|--------|-------|
| `#dev` | Development | Indigo |
| `#security` | Security | Red |
| `#research` | Research | Purple |
| `#learning` | Learning | Teal |
| `#devops` | DevOps | Orange |
| `#admin` | Admin | Gray |

Nested tags for sub-domains: `#dev/backend`, `#security/webapp`, `#learning/certs`, etc.

---

## Priority Indicators

| Emoji | Priority |
|-------|----------|
| 🔴 | High — must be done this week |
| 🟡 | Medium — important but flexible |
| 🟢 | Low — nice to have |

---

## Customization

### Change the font
Edit `.obsidian/snippets/kanban-professional.css` — update the `@import` URL and `--kp-font` variable.

### Add a new domain color
1. Add a `--kp-newdomain` CSS variable in `:root`.
2. Add a `.kanban-plugin__item:has(.tag[href="#newdomain"])` rule for the left border accent.
3. Add a `tagKey` entry in the `%% kanban:settings %%` JSON block of both `Backlog.md` and the weekly template.

### Change the week start day
Edit the `"date-picker-week-start"` value in the kanban settings blocks (`6` = Saturday, `1` = Monday).

---

## License

[MIT](LICENSE) 

## Author

Mohamed Gebril