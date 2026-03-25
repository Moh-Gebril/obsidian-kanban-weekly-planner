<%*
// ─── AUTO-RENAME FILE ON CREATION ──────────────────────────────────────────
const weekLabel = tp.date.now("YYYY-[W]WW");
await tp.file.rename(`Weekly-Kanban-${weekLabel}`);
-%>
---
kanban-plugin: board
week: "<% tp.date.now("YYYY-[W]WW") %>"
date_start: <% tp.date.now("YYYY-MM-DD") %>
date_end: <% tp.date.now("YYYY-MM-DD", 6) %>
type: weekly-kanban
---

## 📋 To Do



## ▸ Sat · <% tp.date.now("DD MMM", 0) %>



## ▸ Sun · <% tp.date.now("DD MMM", 1) %>



## ▸ Mon · <% tp.date.now("DD MMM", 2) %>



## ▸ Tue · <% tp.date.now("DD MMM", 3) %>



## ▸ Wed · <% tp.date.now("DD MMM", 4) %>



## ▸ Thu · <% tp.date.now("DD MMM", 5) %>



## ▸ Fri · <% tp.date.now("DD MMM", 6) %>



## 🧐 Blocked



## ✅ Done



%% kanban:settings
```
{"kanban-plugin":"board","list-collapse":[false,false,false,false,false,false,false,false,false,false,true],"date-display-format":"DD MMM","date-picker-week-start":6,"show-checkboxes":true,"lane-width":290,"tag-colors":[{"tagKey":"#dev","color":"rgba(99, 102, 241, 1)","backgroundColor":"rgba(99, 102, 241, 0.1)"},{"tagKey":"#security","color":"rgba(220, 38, 38, 1)","backgroundColor":"rgba(220, 38, 38, 0.1)"},{"tagKey":"#research","color":"rgba(139, 92, 246, 1)","backgroundColor":"rgba(139, 92, 246, 0.1)"},{"tagKey":"#learning","color":"rgba(14, 165, 133, 1)","backgroundColor":"rgba(14, 165, 133, 0.1)"},{"tagKey":"#devops","color":"rgba(234, 88, 12, 1)","backgroundColor":"rgba(234, 88, 12, 0.1)"},{"tagKey":"#admin","color":"rgba(156, 163, 175, 1)","backgroundColor":"rgba(156, 163, 175, 0.1)"}]}
```
%%
