"use client";
import { useState } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import type { ShiftRecord } from "@/types";
import { Clock, Plus, X } from "lucide-react";

export default function ShiftsPage() {
  const { shifts, addShift } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ employee: "", role: "", date: "", plannedStart: "", actualStart: "", plannedEnd: "", actualEnd: "", note: "" });

  const late = (rec: typeof form) => {
    if (!rec.plannedStart || !rec.actualStart) return 0;
    const [ph, pm] = rec.plannedStart.split(":").map(Number);
    const [ah, am] = rec.actualStart.split(":").map(Number);
    const diff = (ah * 60 + am) - (ph * 60 + pm);
    return diff > 0 ? diff : 0;
  };

  const submit = () => {
    if (!form.employee || !form.date) return;
    addShift({ ...form, late: late(form) || undefined });
    setForm({ employee: "", role: "", date: "", plannedStart: "", actualStart: "", plannedEnd: "", actualEnd: "", note: "" });
    setShowForm(false);
  };

  return (
    <PageShell title="Смены и посещаемость">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <div className="bg-white border border-[#E5DED2] rounded-lg px-4 py-2">
              <p className="text-xs text-[#8A7E72]">Вовремя</p>
              <p className="text-xl font-bold text-green-600">{shifts.filter(s => !s.late).length}</p>
            </div>
            <div className="bg-white border border-[#E5DED2] rounded-lg px-4 py-2">
              <p className="text-xs text-[#8A7E72]">Опозданий</p>
              <p className="text-xl font-bold text-yellow-600">{shifts.filter(s => s.late).length}</p>
            </div>
          </div>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-[#C8A45D] text-white rounded-lg text-sm font-medium hover:bg-[#B8944D]">
            <Plus size={16} />
            Добавить запись
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl border border-[#C8A45D] p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold">Запись о смене</p>
              <button onClick={() => setShowForm(false)}><X size={16} className="text-[#8A7E72]" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Сотрудник *</label>
                <input value={form.employee} onChange={e => setForm(p => ({ ...p, employee: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30" placeholder="Имя и фамилия" />
              </div>
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Должность</label>
                <input value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30" placeholder="Заготовщик" />
              </div>
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Дата *</label>
                <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30" />
              </div>
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Плановый приход</label>
                <input type="time" value={form.plannedStart} onChange={e => setForm(p => ({ ...p, plannedStart: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30" />
              </div>
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Фактический приход</label>
                <input type="time" value={form.actualStart} onChange={e => setForm(p => ({ ...p, actualStart: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30" />
              </div>
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Уход (план)</label>
                <input type="time" value={form.plannedEnd} onChange={e => setForm(p => ({ ...p, plannedEnd: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30" />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={submit} className="px-4 py-2 bg-[#2A2521] text-white rounded-lg text-sm font-medium hover:bg-[#3d3530]">Сохранить</button>
              <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-[#F7F3EC] text-[#8A7E72] rounded-lg text-sm">Отмена</button>
            </div>
          </div>
        )}

        {shifts.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#E5DED2]">
            <EmptyState icon={Clock} title="Записей о сменах нет" description="Фиксируйте приход и уход сотрудников каждый день. Система считает опоздания и переработки." action={{ label: "Добавить запись", onClick: () => setShowForm(true) }} />
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[#E5DED2] overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#F7F3EC]">
                <tr className="text-xs text-[#8A7E72] uppercase tracking-wide">
                  <th className="text-left px-4 py-3 font-medium">Сотрудник</th>
                  <th className="text-left px-4 py-3 font-medium">Должность</th>
                  <th className="text-left px-4 py-3 font-medium">Дата</th>
                  <th className="text-left px-4 py-3 font-medium">План</th>
                  <th className="text-left px-4 py-3 font-medium">Факт</th>
                  <th className="text-left px-4 py-3 font-medium">Статус</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F7F3EC]">
                {shifts.map((s) => (
                  <tr key={s.id} className={`hover:bg-[#F7F3EC] ${s.late ? "bg-yellow-50" : ""}`}>
                    <td className="px-4 py-3 font-medium text-[#1E1E1E]">{s.employee}</td>
                    <td className="px-4 py-3 text-[#8A7E72]">{s.role || "—"}</td>
                    <td className="px-4 py-3 text-[#8A7E72]">{s.date}</td>
                    <td className="px-4 py-3 font-mono text-[#1E1E1E]">{s.plannedStart || "—"}</td>
                    <td className="px-4 py-3 font-mono text-[#1E1E1E]">{s.actualStart || "—"}</td>
                    <td className="px-4 py-3">
                      {s.late ? <Badge variant="warning">+{s.late} мин</Badge> : s.actualStart ? <Badge variant="success">Вовремя</Badge> : <Badge variant="neutral">Не отмечен</Badge>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageShell>
  );
}
