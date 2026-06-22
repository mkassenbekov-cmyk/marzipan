"use client";
import { useState } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import { formatMoney } from "@/lib/utils";
import type { BudgetItem } from "@/types/business";
import { PiggyBank, Plus, X, AlertTriangle } from "lucide-react";

const categoryLabel: Record<BudgetItem["category"], string> = {
  purchase: "Закуп", salary: "ФОТ", rent: "Аренда", utilities: "Коммунальные",
  packaging: "Упаковка", delivery: "Доставка", maintenance: "Ремонт",
  equipment: "Оборудование", other: "Прочее",
};
const statusMap = {
  planned: { label: "Запланировано", variant: "neutral" as const },
  paid: { label: "Оплачено", variant: "success" as const },
  overdue: { label: "Просрочено", variant: "danger" as const },
  deferred: { label: "Отложено", variant: "warning" as const },
};

export default function BudgetPage() {
  const { budgetItems } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [items, setItems] = useState<BudgetItem[]>(budgetItems);
  const [form, setForm] = useState({ category: "purchase" as BudgetItem["category"], name: "", planned: "", dueDate: "", note: "" });

  const totalPlanned = items.reduce((s, i) => s + i.planned, 0);
  const totalPaid = items.filter(i => i.status === "paid").reduce((s, i) => s + (i.actual ?? i.planned), 0);
  const overdue = items.filter(i => i.status === "overdue");
  const deficit = totalPlanned - totalPaid;

  const submit = () => {
    if (!form.name || !form.planned) return;
    const newItem: BudgetItem = { id: String(Date.now()), ...form, planned: Number(form.planned), status: "planned" };
    setItems(p => [...p, newItem]);
    setForm({ category: "purchase", name: "", planned: "", dueDate: "", note: "" });
    setShowForm(false);
  };

  return (
    <PageShell title="Планирование бюджета">
      <div className="space-y-4">
        {overdue.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <AlertTriangle size={18} className="text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-800 font-medium">{overdue.length} платежей просрочено — возможен кассовый разрыв</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white border border-[#E5DED2] rounded-xl p-4">
            <p className="text-xs text-[#8A7E72] uppercase tracking-wide">Запланировано</p>
            <p className="text-2xl font-bold text-[#1E1E1E] mt-1">{items.length > 0 ? formatMoney(totalPlanned) : "—"}</p>
          </div>
          <div className="bg-white border border-[#E5DED2] rounded-xl p-4">
            <p className="text-xs text-[#8A7E72] uppercase tracking-wide">Оплачено</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{totalPaid > 0 ? formatMoney(totalPaid) : "—"}</p>
          </div>
          <div className="bg-white border border-[#E5DED2] rounded-xl p-4">
            <p className="text-xs text-[#8A7E72] uppercase tracking-wide">Дефицит / Остаток</p>
            <p className={`text-2xl font-bold mt-1 ${deficit > 0 ? "text-red-600" : "text-green-600"}`}>
              {items.length > 0 ? formatMoney(Math.abs(deficit)) : "—"}
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-sm text-[#8A7E72]">Все статьи бюджета</p>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-[#C8A45D] text-white rounded-lg text-sm font-medium hover:bg-[#B8944D]">
            <Plus size={16} />
            Добавить статью
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl border border-[#C8A45D] p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold text-[#1E1E1E]">Новая статья бюджета</p>
              <button onClick={() => setShowForm(false)}><X size={16} className="text-[#8A7E72]" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Категория</label>
                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value as BudgetItem["category"] }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30">
                  {Object.entries(categoryLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Название *</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30" placeholder="Закуп авокадо..." />
              </div>
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Сумма (₸) *</label>
                <input type="number" value={form.planned} onChange={e => setForm(p => ({ ...p, planned: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30" placeholder="0" />
              </div>
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Срок оплаты</label>
                <input type="date" value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30" />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={submit} className="px-4 py-2 bg-[#2A2521] text-white rounded-lg text-sm font-medium hover:bg-[#3d3530]">Сохранить</button>
              <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-[#F7F3EC] text-[#8A7E72] rounded-lg text-sm">Отмена</button>
            </div>
          </div>
        )}

        {items.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#E5DED2]">
            <EmptyState icon={PiggyBank} title="Бюджет не запланирован" description="Добавьте статьи расходов: закуп, ФОТ, аренда, коммунальные. Система покажет дефицит и риск кассового разрыва." action={{ label: "Добавить статью", onClick: () => setShowForm(true) }} />
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[#E5DED2] overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#F7F3EC]">
                <tr className="text-xs text-[#8A7E72] uppercase tracking-wide">
                  <th className="text-left px-4 py-3 font-medium">Категория</th>
                  <th className="text-left px-4 py-3 font-medium">Название</th>
                  <th className="text-left px-4 py-3 font-medium">Запланировано</th>
                  <th className="text-left px-4 py-3 font-medium">Оплачено</th>
                  <th className="text-left px-4 py-3 font-medium">Срок</th>
                  <th className="text-left px-4 py-3 font-medium">Статус</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F7F3EC]">
                {items.map((item) => (
                  <tr key={item.id} className={`hover:bg-[#F7F3EC] ${item.status === "overdue" ? "bg-red-50" : ""}`}>
                    <td className="px-4 py-3 text-[#8A7E72]">{categoryLabel[item.category]}</td>
                    <td className="px-4 py-3 font-medium text-[#1E1E1E]">{item.name}</td>
                    <td className="px-4 py-3 font-semibold text-[#1E1E1E]">{formatMoney(item.planned)}</td>
                    <td className="px-4 py-3 text-[#8A7E72]">{item.actual ? formatMoney(item.actual) : "—"}</td>
                    <td className="px-4 py-3 text-[#8A7E72]">{item.dueDate ?? "—"}</td>
                    <td className="px-4 py-3"><Badge variant={statusMap[item.status].variant}>{statusMap[item.status].label}</Badge></td>
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
