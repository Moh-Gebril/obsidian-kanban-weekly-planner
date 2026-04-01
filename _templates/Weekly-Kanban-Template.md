<%*
// ─── WEEK CONFIGURATION ─────────────────────────────────────────────────────
const WEEK_START_DAY = 6; // 0 = Sunday, 6 = Saturday
const WEEKDAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const pad = (value) => String(value).padStart(2, "0");
const toIsoDate = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const toDayLabel = (date) => `${pad(date.getDate())} ${MONTH_SHORT[date.getMonth()]}`;
const getIsoWeek = (date) => {
  const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNumber = utcDate.getUTCDay() || 7;

  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - dayNumber);

  const isoYear = utcDate.getUTCFullYear();
  const yearStart = new Date(Date.UTC(isoYear, 0, 1));
  const weekNumber = Math.ceil((((utcDate - yearStart) / 86400000) + 1) / 7);

  return { isoYear, weekNumber };
};

const today = new Date();
today.setHours(0, 0, 0, 0);

const daysSinceWeekStart = (today.getDay() - WEEK_START_DAY + 7) % 7;
const weekStart = new Date(today);
weekStart.setDate(today.getDate() - daysSinceWeekStart);

const weekDays = Array.from({ length: 7 }, (_, offset) => {
  const date = new Date(weekStart);
  date.setDate(weekStart.getDate() + offset);
  return date;
});

const weekEnd = weekDays[6];
const { isoYear, weekNumber } = getIsoWeek(weekStart);
const weekLabel = `${isoYear}-W${pad(weekNumber)}`;

// ─── AUTO-RENAME FILE ON CREATION ──────────────────────────────────────────
await tp.file.rename(`Weekly-Kanban-${weekLabel}`);
const boardBody = [
  "---",
  "kanban-plugin: board",
  `week: \"${weekLabel}\"`,
  `date_start: ${toIsoDate(weekStart)}`,
  `date_end: ${toIsoDate(weekEnd)}`,
  "type: weekly-kanban",
  "---",
  "",
  "## 📋 To Do",
  "",
  "",
  "",
  ...weekDays.flatMap((date) => [
    `## ▸ ${WEEKDAY_SHORT[date.getDay()]} · ${toDayLabel(date)}`,
    "",
    "",
    "",
  ]),
  "## 🧐 Blocked",
  "",
  "",
  "",
  "## ✅ Done",
  "",
  "",
  "",
].join("\n");

tR += boardBody;
-%>
%% kanban:settings
```
{"kanban-plugin":"board","list-collapse":[false,false,false,false,false,false,false,false,false,false,true],"date-display-format":"DD MMM","date-picker-week-start":6,"show-checkboxes":true,"lane-width":290,"tag-colors":[{"tagKey":"#dev","color":"rgba(99, 102, 241, 1)","backgroundColor":"rgba(99, 102, 241, 0.1)"},{"tagKey":"#security","color":"rgba(220, 38, 38, 1)","backgroundColor":"rgba(220, 38, 38, 0.1)"},{"tagKey":"#research","color":"rgba(139, 92, 246, 1)","backgroundColor":"rgba(139, 92, 246, 0.1)"},{"tagKey":"#learning","color":"rgba(14, 165, 133, 1)","backgroundColor":"rgba(14, 165, 133, 0.1)"},{"tagKey":"#devops","color":"rgba(234, 88, 12, 1)","backgroundColor":"rgba(234, 88, 12, 0.1)"},{"tagKey":"#admin","color":"rgba(156, 163, 175, 1)","backgroundColor":"rgba(156, 163, 175, 0.1)"}]}
```
%%
