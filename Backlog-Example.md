---
kanban-plugin: board
type: backlog-example
locale: en
cssclasses: "kanban-en"
---

> Example board: rename `Project A`, `Project B`, and `Project C` to your real projects. Replace `#project/a`, `#project/b`, and `#project/c` in the tasks and in the `tag-colors` block at the bottom to keep one color per project. Priority markers: `🔴` High, `🟡` Medium, `🟢` Low.

## Inbox

- [ ] #project/a 🟡 Collect open questions from the kickoff meeting
- [ ] #project/c 🟢 Capture ideas for the first monthly report


## Project A

- [ ] #project/a 🔴 Finalize project scope and success criteria
- [ ] #project/a 🟡 Prepare the stakeholder update draft
- [ ] #project/a 🟢 Clean up project notes and archive duplicates


## Project B

- [ ] #project/b 🔴 Set up the shared staging workspace
- [ ] #project/b 🟡 Review the vendor checklist and dependencies
- [ ] #project/b 🟢 Document team roles for the rollout


## Project C

- [ ] #project/c 🔴 Build the first reporting outline
- [ ] #project/c 🟡 Confirm data owners and approval flow
- [ ] #project/c 🟢 Create a list of follow-up questions


%% kanban:settings
```
{"kanban-plugin":"board","list-collapse":[false,false,false,false],"date-display-format":"DD MMM","date-picker-week-start":6,"show-checkboxes":true,"lane-width":320,"tag-colors":[{"tagKey":"#project/a","color":"rgba(37, 99, 235, 1)","backgroundColor":"rgba(37, 99, 235, 0.12)"},{"tagKey":"#project/b","color":"rgba(5, 150, 105, 1)","backgroundColor":"rgba(5, 150, 105, 0.12)"},{"tagKey":"#project/c","color":"rgba(217, 119, 6, 1)","backgroundColor":"rgba(217, 119, 6, 0.12)"}]}
```
%%
