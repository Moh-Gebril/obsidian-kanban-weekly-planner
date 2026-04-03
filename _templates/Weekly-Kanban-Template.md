<%*
// ─── WEEK CONFIGURATION ─────────────────────────────────────────────────────
const WEEK_START_DAY = 6; // 0 = Sunday, 6 = Saturday
const LOCALES = {
  en: {
    cssclasses: "kanban-en",
    weekdayPrefix: "▸",
    lanes: {
      todo: "To Do",
      blocked: "Blocked",
      done: "Done",
    },
    weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  },
  ar: {
    cssclasses: "kanban-ar kanban-rtl",
    weekdayPrefix: "◂",
    lanes: {
      todo: "قائمة المهام",
      blocked: "متوقف",
      done: "مكتمل",
    },
    weekdays: ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
    months: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"],
  },
};

const pad = (value) => String(value).padStart(2, "0");
const toIsoDate = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const locale = (await tp.system.suggester(["English", "العربية"], ["en", "ar"], false, "Choose board language / اختر لغة اللوحة")) ?? "en";
const t = LOCALES[locale] ?? LOCALES.en;
const fileExists = (baseName) => tp.app.vault.getAbstractFileByPath(`${baseName}.md`) !== null;
const toDayLabel = (date, monthNames) => `${pad(date.getDate())} ${monthNames[date.getMonth()]}`;
const toDayHeading = (date, config) => `## ${config.weekdayPrefix} ${config.weekdays[date.getDay()]} · ${toDayLabel(date, config.months)}`;
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
const targetFileName = locale === "ar" ? `${weekLabel}-ar` : weekLabel;

// ─── AUTO-RENAME FILE ON CREATION ──────────────────────────────────────────
if (fileExists(targetFileName)) {
  throw new Error(`A ${locale === "ar" ? "Arabic" : "English"} board for ${weekLabel} already exists as ${targetFileName}.md`);
}

await tp.file.rename(targetFileName);
const boardBody = [
  "---",
  "kanban-plugin: board",
  `week: \"${weekLabel}\"`,
  `date_start: ${toIsoDate(weekStart)}`,
  `date_end: ${toIsoDate(weekEnd)}`,
  `locale: ${locale}`,
  `cssclasses: \"${t.cssclasses}\"`,
  "type: weekly-kanban",
  "---",
  "",
  `## ${t.lanes.todo}`,
  "",
  "",
  "",
  ...weekDays.flatMap((date) => [
    toDayHeading(date, t),
    "",
    "",
    "",
  ]),
  `## ${t.lanes.blocked}`,
  "",
  "",
  "",
  `## ${t.lanes.done}`,
  "",
  "",
  "",
].join("\n");

tR += boardBody;
-%>
%% kanban:settings
```
{"kanban-plugin":"board","list-collapse":[false,false,false,false,false,false,false,false,false,false,true],"date-display-format":"DD MMM","date-picker-week-start":6,"show-checkboxes":true,"lane-width":290,"tag-colors":[]}
```
%%
