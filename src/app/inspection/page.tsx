"use client";
import { useState } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck, CheckCircle2, XCircle, ChevronDown, ChevronUp } from "lucide-react";

interface CheckItem {
  id: string;
  label: string;
  status: "ok" | "fail" | "pending";
  note?: string;
}

interface InspectionSection {
  id: string;
  title: string;
  time: "morning" | "day" | "evening" | "anytime";
  items: CheckItem[];
}

const TEMPLATE: { id: string; title: string; time: InspectionSection["time"]; items: { id: string; label: string }[] }[] = [
  {
    id: "night-handover", title: "Приём ночной смены", time: "morning",
    items: [
      { id: "night-report", label: "Отчёт ночной смены проверен" },
      { id: "night-stock", label: "Остатки после ночной сборки приняты" },
      { id: "night-issues", label: "Проблемы ночной смены зафиксированы" },
    ]
  },
  {
    id: "production", title: "Производство и заготовки", time: "morning",
    items: [
      { id: "prep-check", label: "Заготовки проверены" },
      { id: "bread-check", label: "Булочки и выпечка проверены" },
      { id: "assembly-check", label: "Сборка налажена" },
      { id: "packaging-check", label: "Упаковка в наличии" },
    ]
  },
  {
    id: "storage", title: "Холодильники и хранение", time: "morning",
    items: [
      { id: "fridge-temp", label: "Температура холодильников в норме" },
      { id: "fridge-order", label: "Порядок в холодильниках" },
      { id: "expiry", label: "Сроки годности проверены" },
      { id: "labeling", label: "Маркировки на продукции есть" },
    ]
  },
  {
    id: "gram-morning", title: "Граммовки — утро", time: "morning",
    items: [
      { id: "gram-am-1", label: "Бейглы — вес проверен" },
      { id: "gram-am-2", label: "Хот-доги — вес проверен" },
      { id: "gram-am-3", label: "Начинки — граммовка по техкарте" },
    ]
  },
  {
    id: "gram-day", title: "Граммовки — день", time: "day",
    items: [
      { id: "gram-pm-1", label: "Контрольное взвешивание пройдено" },
      { id: "gram-pm-2", label: "Отклонений нет" },
    ]
  },
  {
    id: "gram-evening", title: "Граммовки — вечер", time: "evening",
    items: [
      { id: "gram-eve-1", label: "Итоговая проверка граммовок" },
      { id: "gram-eve-2", label: "Результаты зафиксированы" },
    ]
  },
  {
    id: "cleanliness", title: "Чистота зон", time: "anytime",
    items: [
      { id: "zone-prep", label: "Зона заготовок чистая" },
      { id: "zone-bake", label: "Зона пекарни чистая" },
      { id: "zone-assembly", label: "Зона сборки чистая" },
      { id: "zone-storage", label: "Склад в порядке" },
      { id: "cleaning-log", label: "Журнал уборки заполнен" },
    ]
  },
  {
    id: "end-of-day", title: "Итог смены", time: "evening",
    items: [
      { id: "eod-stock", label: "Остатки на конец дня зафиксированы" },
      { id: "eod-writeoffs", label: "Все списания внесены" },
      { id: "eod-photos", label: "Фотоотчёты сданы" },
      { id: "eod-tasks", label: "Задачи на завтра поставлены" },
      { id: "eod-report", label: "Итоговый отчёт сформирован" },
    ]
  },
];

const timeLabel: Record<InspectionSection["time"], string> = {
  morning: "Утро", day: "День", evening: "Вечер", anytime: "В течение дня"
};
const timeBadge: Record<InspectionSection["time"], "accent" | "warning" | "neutral" | "success"> = {
  morning: "accent", day: "warning", evening: "neutral", anytime: "success"
};

function initSections(): InspectionSection[] {
  return TEMPLATE.map(s => ({
    ...s,
    items: s.items.map(i => ({ ...i, status: "pending" as const }))
  }));
}

export default function InspectionPage() {
  const [sections, setSections] = useState<InspectionSection[]>(initSections);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState(false);

  const today = new Date().toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" });
  const allItems = sections.flatMap(s => s.items);
  const okCount = allItems.filter(i => i.status === "ok").length;
  const failCount = allItems.filter(i => i.status === "fail").length;
  const pendingCount = allItems.filter(i => i.status === "pending").length;
  const pct = Math.round((okCount / allItems.length) * 100);

  const toggle = (secId: string, itemId: string, status: CheckItem["status"]) => {
    setSections(prev => prev.map(s => s.id === secId ? {
      ...s,
      items: s.items.map(i => i.id === itemId ? { ...i, status: i.status === status ? "pending" : status } : i)
    } : s));
  };

  const setItemNote = (secId: string, itemId: string, text: string) => {
    setSections(prev => prev.map(s => s.id === secId ? {
      ...s,
      items: s.items.map(i => i.id === itemId ? { ...i, note: text } : i)
    } : s));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <PageShell title="Журнал обхода">
      <div className="space-y-4 max-w-2xl">

        {/* Progress header */}
        <div className="bg-white rounded-xl border border-[#E5DED2] p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-semibold text-[#1E1E1E] capitalize">{today}</p>
              <p className="text-xs text-[#8A7E72] mt-0.5">Дневной журнал обхода</p>
            </div>
            <button
              onClick={handleSave}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${saved ? "bg-green-500 text-white" : "bg-[#2A2521] text-white hover:bg-[#3d3530]"}`}
            >
              {saved ? "✓ Сохранено" : "Сохранить"}
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-[#F7F3EC] rounded-full h-2">
              <div className="h-2 rounded-full bg-[#C8A45D] transition-all duration-300" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-sm font-bold text-[#1E1E1E] w-10 text-right">{pct}%</span>
          </div>
          <div className="flex gap-4 mt-2 text-xs">
            <span className="text-green-600 font-medium">✓ {okCount} OK</span>
            {failCount > 0 && <span className="text-red-600 font-medium">✗ {failCount} нарушений</span>}
            <span className="text-[#8A7E72]">○ {pendingCount} не проверено</span>
          </div>
        </div>

        {/* Sections */}
        {sections.map((section) => {
          const sOk = section.items.filter(i => i.status === "ok").length;
          const sFail = section.items.filter(i => i.status === "fail").length;
          const isCollapsed = collapsed[section.id];

          return (
            <div key={section.id} className={`bg-white rounded-xl border overflow-hidden ${sFail > 0 ? "border-red-200" : "border-[#E5DED2]"}`}>
              <button
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#F7F3EC] transition-colors"
                onClick={() => setCollapsed(p => ({ ...p, [section.id]: !p[section.id] }))}
              >
                <div className="flex items-center gap-2">
                  <ClipboardCheck size={14} className={sFail > 0 ? "text-red-500" : "text-[#C8A45D]"} />
                  <span className="text-sm font-semibold text-[#1E1E1E]">{section.title}</span>
                  <Badge variant={timeBadge[section.time]}>{timeLabel[section.time]}</Badge>
                  {sFail > 0 && (
                    <span className="text-xs font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full">{sFail} нарушения</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#8A7E72]">{sOk}/{section.items.length}</span>
                  {isCollapsed ? <ChevronDown size={14} className="text-[#8A7E72]" /> : <ChevronUp size={14} className="text-[#8A7E72]" />}
                </div>
              </button>

              {!isCollapsed && (
                <div className="divide-y divide-[#F7F3EC]">
                  {section.items.map((item) => (
                    <div key={item.id} className={`px-4 py-3 ${item.status === "fail" ? "bg-red-50" : item.status === "ok" ? "bg-green-50/40" : ""}`}>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#1E1E1E] flex-1">{item.label}</span>
                        <div className="flex items-center gap-1.5 ml-3">
                          <button
                            onClick={() => toggle(section.id, item.id, "ok")}
                            className={`p-1.5 rounded-lg transition-colors ${item.status === "ok" ? "bg-green-100 text-green-600" : "text-[#C8C0B4] hover:text-green-500 hover:bg-green-50"}`}
                          >
                            <CheckCircle2 size={20} />
                          </button>
                          <button
                            onClick={() => toggle(section.id, item.id, "fail")}
                            className={`p-1.5 rounded-lg transition-colors ${item.status === "fail" ? "bg-red-100 text-red-500" : "text-[#C8C0B4] hover:text-red-400 hover:bg-red-50"}`}
                          >
                            <XCircle size={20} />
                          </button>
                        </div>
                      </div>
                      {item.status === "fail" && (
                        <input
                          placeholder="Описание нарушения..."
                          value={item.note ?? ""}
                          onChange={e => setItemNote(section.id, item.id, e.target.value)}
                          className="mt-2 w-full text-xs border border-red-200 rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-red-300 bg-white"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}
