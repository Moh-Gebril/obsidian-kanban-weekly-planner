---
kanban-plugin: board
type: backlog-example
locale: en
cssclasses: "kanban-en"
---

> Example board: rename `Project A`, `Project B`, and `Project C`, or add `Project D` and beyond. The included local plugin derives the project tag from the lane title and keeps it synced on cards in backlog boards. Priority markers: `🔴` High, `🟡` Medium, `🟢` Low.

## Inbox

- [ ] 🟡 Collect open questions from the kickoff meeting
- [ ] 🟢 Capture ideas for the first monthly report


## Project A

- [ ] #project-a 🔴 Finalize project scope and success criteria
- [ ] #project-a 🟡 Prepare the stakeholder update draft
- [ ] #project-a 🟢 Clean up project notes and archive duplicates


## Project B

- [ ] #project-b 🔴 Set up the shared staging workspace
- [ ] #project-b 🟡 Review the vendor checklist and dependencies
- [ ] #project-b 🟢 Document team roles for the rollout


## Project C

- [ ] #project-c 🔴 Build the first reporting outline
- [ ] #project-c 🟡 Confirm data owners and approval flow
- [ ] #project-c 🟢 Create a list of follow-up questions


%% kanban:settings
```
{"kanban-plugin":"board","list-collapse":[false,false,false,false],"date-display-format":"DD MMM","date-picker-week-start":6,"show-checkboxes":true,"lane-width":320,"tag-colors":[]}
```
%%
