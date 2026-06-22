"use client";
import { useState } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import { formatMoney } from "@/lib/utils";
import type { WriteOff } from "@/types";
import { Trash2, Plus, X } from "lucide-react";

const statusMap = {
  pending: { label: "Ожидает", variant: "warning" as const },
  approved: { label: "Одобрено", variant: "success" as const },
  reviewed: { label: "Проверено", variant: "accent" as const },
};

export default function WriteOffsPage() {
  const { writeOffs, addWriteOff } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ product: "", weight: "", amount: "", reason: "", employee: "", shift: "" });

  const total = writeOffs.reduce((s, w) => s + w.amount, 0);

  const submit = () => {
    if (!form.product || !form.reason) return;
    addWriteOff({ ...form, weight: Number(form.weight), amount: Number(form.amount), date: new Date().toLocaleDateString("ru-RU"), status: "pending" });
    setForm({ product: "", weight: "", amount: "", reason: "", employee: "", shift: "" });
    setShowForm(false);
  };

  return (
    <PageShell title="Списания">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <div className="bg-white border border-[#E5DED2] rounded-xl px-4 py-3">
              <p className="text-xs text-[#8A7E72]">Всего списаний</p>
              <p className={`text-xl font-bold ${total > 0 ? "text-red-600" : "text-[#C8C0B4]"}`}>{total > 0 ? formatMoney(total) : "—"}</p>
            </div>
            <div className="bg-white border border-[#E5DED2] rounded-xl px-4 py-3">
              <p className="text-xs text-[#8A7E72]">Записей</p>
              <p className="text-xl font-bold text-[#1E1E1E]">{writeOffs.length}</p>
            </div>
          </div>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-[#C8A45D] text-white rounded-lg text-sm font-medium hover:bg-[#B8944D]">
            <Plus size={16} />
            Зафиксировать
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl border border-[#C8A45D] p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold">Новое списание</p>
              <button onClick={() => setShowForm(false)}><X size={16} className="text-[#8A7E72]" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Продукт *</label>
                <input value={form.product} onChange={e => setForm(p => ({ ...p, product: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30" placeholder="Название" />
              </div>
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Причина *</label>
                <input value={form.reason} onChange={e => setForm(p => ({ ...p, reason: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30" placeholder="Перезрело, истёк срок..." />
              </div>
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Вес (кг)</label>
                <input type="number" value={form.weight} onChange={e => setForm(p => ({ ...p, weight: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30" placeholder="0" />
              </div>
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Сумма (₸)</label>
                <input type="number" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30" placeholder="0" />
              </div>
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Сотрудник</label>
                <input value={form.employee} onChange={e => setForm(p => ({ ...p, employee: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30" placeholder="Имя" />
              </div>
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Смена</label>
                <input value={form.shift} onChange={e => setForm(p => ({ ...p, shift: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30" placeholder="Ночная / Дневная" />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={submit} className="px-4 py-2 bg-[#2A2521] text-white rounded-lg text-sm font-medium hover:bg-[#3d3530]">Сохранить</button>
              <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-[#F7F3EC] text-[#8A7E72] rounded-lg text-sm">Отмена</button>
            </div>
          </div>
        )}

        {writeOffs.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#E5DED2]">
            <EmptyState icon={Trash2} title="Списаний нет" description="Фиксируйте каждое списание с указанием причины, веса и суммы. ИИ анализирует повторяющиеся списания." action={{ label: "Зафиксировать списание", onClick: () => setShowForm(true) }} />
          </div>
        ) : (
          <div className="space-y-2">
            {writeOffs.map((w) => (
              <div key={w.id} className="bg-white rounded-xl border border-[#E5DED2] p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-[#1E1E1E]">{w.product}</p>
                      <Badge variant={statusMap[w.status]?.variant ?? "warning"}>{statusMap[w.status]?.label}</Badge>
                    </div>
                    <p className="text-xs text-[#8A7E72]">{w.reason}</p>
                    <p className="text-xs text-[#8A7E72] mt-0.5">{w.employee} · {w.shift} · {w.date}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-lg font-bold text-red-600">{w.amount > 0 ? formatMoney(w.amount) : "—"}</p>
                    {w.weight > 0 && <p className="text-xs text-[#8A7E72]">{w.weight} кг</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
