# Obsidian Kanban Weekly Planner

An Obsidian planning vault built around two working boards:

- a persistent backlog for project capture and prioritization
- a weekly Kanban board generated from a template

The vault supports English and Arabic weekly boards, automatic project tagging from backlog lane titles, and consistent project styling across backlog and weekly execution boards.

![Backlog Board](assets/screenshots/backlog-overview.png)

## What This Project Does

This repository is not an Obsidian plugin package on its own. It is a ready-to-use Obsidian vault that combines:

- `Backlog.md` as the main planning board
- `_templates/Weekly-Kanban-Template.md` for weekly board generation
- a local vault plugin that derives project tags from backlog lanes
- a shared CSS snippet for Kanban layout, typography, and RTL support
- reference example boards in English and Arabic

The intended workflow is:

1. Capture work in `Backlog.md`
2. Rename project lanes to real project names
3. Let the local plugin generate and maintain project tags
4. Create the weekly board from the template
5. Move tagged work into the current week
6. Track execution day by day

## Core Features

### Backlog Planning

- Permanent backlog board for project-level planning
- Minimal starter structure for first-time setup:
  - `Inbox`
  - `Project A`
  - `Project B`
  - `Project C`
- Separate English and Arabic example backlog boards for reference

### Weekly Board Generation

- Weekly board template powered by Templater
- Board language prompt on creation: English or Arabic
- Strict filename rules:
  - English: `YYYY-Www.md`
  - Arabic: `YYYY-Www-ar.md`
- Explicit collision protection if the target weekly board already exists
- Stable machine-readable metadata:
  - `week`
  - `date_start`
  - `date_end`
  - `locale`
  - `cssclasses`
- Saturday-to-Friday weekly range

### Project Automation

The local plugin `project-lane-auto-tag` is the main new feature in the current repository.

It turns backlog lane titles into project identities:

- `## Wazuh System` becomes `#wazuh-system`
- `## Project D` becomes `#project-d`
- Arabic lane titles generate Arabic-script tags

It also keeps project tags synchronized:

- cards added inside a project lane receive the lane-derived project tag
- moving a card between project lanes replaces the managed project tag
- moving a card to `Inbox` or `الوارد` removes the managed project tag
- non-project tags remain untouched

Weekly boards do not generate project tags. They render the project styling for any project tag already present on the card.

### Project Styling

Project styling is global and tag-driven rather than repeated manually in each board:

- colored project tag pill
- project-colored card accent border
- subtle tinted card background
- consistent styling in both backlog and weekly boards

This produces a cleaner workflow than editing project colors board by board.

### Arabic Support

Arabic support is a first-class part of the vault:

- Arabic weekly board labels
- Arabic weekday names
- Arabic month names
- RTL board layout
- Arabic CSS classes for weekly boards
- Arabic backlog lanes can generate Arabic-script project tags

Arabic weekly boards currently use:

- `قائمة المهام`
- `متوقف`
- `مكتمل`

### Priority Markers

Task priority is intentionally lightweight and visible in plain Markdown:

- `🔴` High
- `🟡` Medium
- `🟢` Low

## Repository Contents

```text
obsidian-kanban-weekly-planner/
├── .obsidian/
│   ├── plugins/
│   │   └── project-lane-auto-tag/
│   └── snippets/
│       └── kanban-professional.css
├── _templates/
│   └── Weekly-Kanban-Template.md
├── Backlog.md
├── Backlog-Example.md
├── Backlog-Example-ar.md
├── 2026-W01.md
├── 2026-W01-ar.md
├── assets/
│   └── screenshots/
└── README.md
```

## Setup

1. Open the repository as an Obsidian vault.
2. Enable the required community plugins:
   - `Templater`
   - `Kanban`
   - `project-lane-auto-tag` (included locally in this repo)
3. Set `Settings -> Templater -> Template folder location` to `_templates`.
4. Enable the CSS snippet `kanban-professional` in `Settings -> Appearance -> CSS snippets`.
5. Open `Backlog.md`.

The committed vault also includes `Calendar` and `Dataview` in `.obsidian`, but they are optional for the planner workflow.

## How To Use It

### 1. Set up your backlog

- Open `Backlog.md`
- Rename `Project A`, `Project B`, and `Project C` to your actual project names
- Add more project lanes whenever needed
- Add cards under the correct project lane

The plugin will derive and maintain the project tag for each card automatically.

### 2. Create the weekly board

1. Run `Templater: Create new note from template`
2. Select `Weekly-Kanban-Template`
3. Choose English or Arabic
4. Open the generated weekly board

### 3. Run the week

- Move tagged work from the backlog into `To Do` or `قائمة المهام`
- Schedule work into day lanes
- Move blocked work to `Blocked` or `متوقف`
- Move completed work to `Done` or `مكتمل`

![Weekly Board](assets/screenshots/weekly-board-overview.png)

## Example Files

The repository includes four reference boards:

- `Backlog-Example.md`
- `Backlog-Example-ar.md`
- `2026-W01.md`
- `2026-W01-ar.md`

They are not required for the workflow. They exist to demonstrate:

- project lane naming
- automatic project tag generation
- English and Arabic board usage
- priority markers
- project styling on backlog and weekly boards

## Plugin Commands

The local project plugin adds:

- `Sync project tags in current board`
- `Rebuild project tag registry`

Use them if you want to force a manual resync after larger edits.

## Customization

Common customization points:

- Change the week start logic:
  - update `WEEK_START_DAY` in `_templates/Weekly-Kanban-Template.md`
- Change weekly board labels:
  - edit the locale map in `_templates/Weekly-Kanban-Template.md`
- Change Arabic wording:
  - update the Arabic label strings, weekday names, or month names in the same template
- Change base Kanban styling:
  - edit `.obsidian/snippets/kanban-professional.css`
- Change reserved non-project lanes:
  - edit the `project-lane-auto-tag` plugin settings
- Change project colors:
  - update the palette in `.obsidian/plugins/project-lane-auto-tag/main.js`

## Notes

- `Backlog.md` is the main starter board for real use.
- Weekly boards consume project tags; they do not generate them.
- Project styling is generated dynamically by the local plugin.
- Local runtime files such as workspace state and plugin data should stay out of version control.

## License

[MIT](LICENSE)

## Author

Mohamed Gebril
