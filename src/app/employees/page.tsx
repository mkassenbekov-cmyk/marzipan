"use client";
import { useState } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import type { Employee } from "@/types";
import { formatMoney } from "@/lib/utils";
import { Users, Plus, X, Pencil, Trash2, Moon, Sun } from "lucide-react";

const emptyForm = {
  name: "", position: "", shiftType: "day" as "day" | "night",
  shiftRate: "", latePenalty: "", absencePenalty: "", phone: "", active: true,
};

export default function EmployeesPage() {
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const openNew = () => { setForm(emptyForm); setEditId(null); setShowForm(true); };
  const openEdit = (e: Employee) => {
    setForm({
      name: e.name, position: e.position ?? "", shiftType: e.shiftType ?? "day",
      shiftRate: String(e.shiftRate || ""), latePenalty: String(e.latePenalty || ""),
      absencePenalty: String(e.absencePenalty || ""), phone: e.phone ?? "", active: e.active,
    });
    setEditId(e.id); setShowForm(true);
  };

  const submit = async () => {
    if (!form.name) return;
    const payload = {
      name: form.name, position: form.position, shiftType: form.shiftType,
      shiftRate: Number(form.shiftRate) || 0, latePenalty: Number(form.latePenalty) || 0,
      absencePenalty: Number(form.absencePenalty) || 0, phone: form.phone, active: form.active,
    };
    if (editId) await updateEmployee(editId, payload);
    else await addEmployee(payload);
    setShowForm(false); setForm(emptyForm); setEditId(null);
  };

  const remove = async (id: string) => {
    if (confirm("Удалить сотрудника?")) await deleteEmployee(id);
  };

  const active = employees.filter(e => e.active);

  return (
    <PageShell title="Сотрудники">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <div className="bg-white border border-[#E5DED2] rounded-lg px-4 py-2">
              <p className="text-xs text-[#8A7E72]">Всего</p>
              <p className="text-xl font-bold text-[#1E1E1E]">{employees.length}</p>
            </div>
            <div className="bg-white border border-[#E5DED2] rounded-lg px-4 py-2">
              <p className="text-xs text-[#8A7E72]">Активных</p>
              <p className="text-xl font-bold text-green-600">{active.length}</p>
            </div>
          </div>
          <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 bg-[#C8A45D] text-white rounded-lg text-sm font-medium hover:bg-[#B8944D]">
            <Plus size={16} /> Добавить
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl border border-[#C8A45D] p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold">{editId ? "Редактировать сотрудника" : "Новый сотрудник"}</p>
              <button onClick={() => setShowForm(false)}><X size={16} className="text-[#8A7E72]" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Имя и фамилия *</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30" placeholder="Иван Петров" />
              </div>
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Должность</label>
                <input value={form.position} onChange={e => setForm(p => ({ ...p, position: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30" placeholder="Заготовщик / Пекарь / Сборщик" />
              </div>
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Тип смены</label>
                <select value={form.shiftType} onChange={e => setForm(p => ({ ...p, shiftType: e.target.value as "day" | "night" }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30">
                  <option value="day">Дневная</option>
                  <option value="night">Ночная</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Телефон</label>
                <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30" placeholder="+7 700 000 0000" />
              </div>
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Ставка за смену ₸ *</label>
                <input type="number" value={form.shiftRate} onChange={e => setForm(p => ({ ...p, shiftRate: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30" placeholder="10000" />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-xs text-[#8A7E72] block mb-1">Штраф опоздание ₸</label>
                  <input type="number" value={form.latePenalty} onChange={e => setForm(p => ({ ...p, latePenalty: e.target.value }))}
                    className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30" placeholder="1000" />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-[#8A7E72] block mb-1">Штраф прогул ₸</label>
                  <input type="number" value={form.absencePenalty} onChange={e => setForm(p => ({ ...p, absencePenalty: e.target.value }))}
                    className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30" placeholder="5000" />
                </div>
              </div>
            </div>
            <label className="flex items-center gap-2 mt-3 text-sm text-[#1E1E1E] cursor-pointer">
              <input type="checkbox" checked={form.active} onChange={e => setForm(p => ({ ...p, active: e.target.checked }))} className="accent-[#C8A45D]" />
              Работает (активен)
            </label>
            <div className="flex gap-2 mt-4">
              <button onClick={submit} className="px-4 py-2 bg-[#2A2521] text-white rounded-lg text-sm font-medium hover:bg-[#3d3530]">Сохранить</button>
              <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-[#F7F3EC] text-[#8A7E72] rounded-lg text-sm">Отмена</button>
            </div>
          </div>
        )}

        {employees.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#E5DED2]">
            <EmptyState icon={Users} title="Сотрудников нет"
              description="Добавьте сотрудников цеха с их ставкой за смену. На основе смен система рассчитает зарплату."
              action={{ label: "Добавить сотрудника", onClick: openNew }} />
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[#E5DED2] overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#F7F3EC]">
                <tr className="text-xs text-[#8A7E72] uppercase tracking-wide">
                  <th className="text-left px-4 py-3 font-medium">Сотрудник</th>
                  <th className="text-left px-4 py-3 font-medium">Должность</th>
                  <th className="text-left px-4 py-3 font-medium">Смена</th>
                  <th className="text-right px-4 py-3 font-medium">Ставка</th>
                  <th className="text-right px-4 py-3 font-medium">Штрафы (опозд/прогул)</th>
                  <th className="text-left px-4 py-3 font-medium">Статус</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F7F3EC]">
                {employees.map((e) => (
                  <tr key={e.id} className={`hover:bg-[#F7F3EC] ${!e.active ? "opacity-50" : ""}`}>
                    <td className="px-4 py-3 font-medium text-[#1E1E1E]">
                      <div className="flex items-center gap-2">
                        {e.name}
                        {e.phone && <span className="text-xs text-[#C8C0B4]">{e.phone}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#8A7E72]">{e.position || "—"}</td>
                    <td className="px-4 py-3">
                      {e.shiftType === "night"
                        ? <span className="flex items-center gap-1 text-[#8A7E72]"><Moon size={12} /> Ночь</span>
                        : <span className="flex items-center gap-1 text-[#8A7E72]"><Sun size={12} /> День</span>}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-[#1E1E1E]">{formatMoney(e.shiftRate)}</td>
                    <td className="px-4 py-3 text-right text-[#8A7E72] text-xs">
                      {formatMoney(e.latePenalty)} / {formatMoney(e.absencePenalty)}
                    </td>
                    <td className="px-4 py-3">
                      {e.active ? <Badge variant="success">Работает</Badge> : <Badge variant="neutral">Неактивен</Badge>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => openEdit(e)} className="p-1.5 rounded-lg hover:bg-[#F7F3EC] text-[#8A7E72]"><Pencil size={14} /></button>
                        <button onClick={() => remove(e.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-[#8A7E72] hover:text-red-500"><Trash2 size={14} /></button>
                      </div>
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
