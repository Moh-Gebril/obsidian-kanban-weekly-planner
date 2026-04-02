---
kanban-plugin: board
type: backlog-example
locale: ar
cssclasses: "kanban-ar kanban-rtl"
---

> لوحة مرجعية: أعد تسمية `المشروع أ` و`المشروع ب` و`المشروع ج` بما يناسب مشاريعك الحقيقية. غيّر الوسوم `#project/a` و`#project/b` و`#project/c` داخل المهام وداخل `tag-colors` في أسفل الملف للحفاظ على لون مستقل لكل مشروع. دلالات الأولوية: `🔴` عالية، `🟡` متوسطة، `🟢` منخفضة.

## الوارد

- [ ] #project/a 🟡 جمع الأسئلة المفتوحة من اجتماع البداية
- [ ] #project/c 🟢 تدوين أفكار التقرير الشهري الأول


## المشروع أ

- [ ] #project/a 🔴 إنهاء نطاق المشروع ومعايير النجاح
- [ ] #project/a 🟡 إعداد مسودة تحديث لأصحاب المصلحة
- [ ] #project/a 🟢 تنظيف ملاحظات المشروع وأرشفة المكرر


## المشروع ب

- [ ] #project/b 🔴 تجهيز بيئة العمل المشتركة
- [ ] #project/b 🟡 مراجعة قائمة المورد والاعتماديات
- [ ] #project/b 🟢 توثيق أدوار الفريق في الإطلاق


## المشروع ج

- [ ] #project/c 🔴 إعداد الهيكل الأولي للتقرير
- [ ] #project/c 🟡 تأكيد ملاك البيانات ومسار الاعتماد
- [ ] #project/c 🟢 إعداد قائمة بالأسئلة اللاحقة


%% kanban:settings
```
{"kanban-plugin":"board","list-collapse":[false,false,false,false],"date-display-format":"DD MMM","date-picker-week-start":6,"show-checkboxes":true,"lane-width":320,"tag-colors":[{"tagKey":"#project/a","color":"rgba(37, 99, 235, 1)","backgroundColor":"rgba(37, 99, 235, 0.12)"},{"tagKey":"#project/b","color":"rgba(5, 150, 105, 1)","backgroundColor":"rgba(5, 150, 105, 0.12)"},{"tagKey":"#project/c","color":"rgba(217, 119, 6, 1)","backgroundColor":"rgba(217, 119, 6, 0.12)"}]}
```
%%
