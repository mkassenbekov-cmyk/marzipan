"use client";
import { useState } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import { formatMoney } from "@/lib/utils";
import type { Invoice } from "@/types/business";
import { FileCheck, Plus, X, AlertTriangle, Upload } from "lucide-react";

const statusMap: Record<string, { label: string; variant: "neutral" | "accent" | "success" | "danger" | "warning" }> = {
  draft: { label: "Черновик", variant: "neutral" },
  pending: { label: "Ожидает", variant: "neutral" },
  received: { label: "Получена", variant: "accent" },
  verified: { label: "Проверена", variant: "success" },
  paid: { label: "Оплачена", variant: "success" },
  dispute: { label: "Спорная", variant: "danger" },
  duplicate: { label: "Дубль", variant: "danger" },
};

export default function InvoicesPage() {
  const { invoices, addInvoice } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ number: "", supplierName: "", date: "", amount: "", actualAmount: "", note: "" });

  const submit = () => {
    if (!form.number || !form.supplierName || !form.date) return;
    const isDuplicate = invoices.some(i => i.number === form.number && i.supplierName === form.supplierName);
    addInvoice({
      number: form.number,
      supplierName: form.supplierName,
      date: form.date,
      amount: Number(form.amount),
      actualAmount: form.actualAmount ? Number(form.actualAmount) : undefined,
      status: isDuplicate ? "duplicate" : "received",
      note: form.note || undefined,
    });
    setForm({ number: "", supplierName: "", date: "", amount: "", actualAmount: "", note: "" });
    setShowForm(false);
  };

  const problems = invoices.filter(i => i.status === "duplicate" || i.status === "dispute");

  return (
    <PageShell title="Накладные">
      <div className="space-y-4">
        {problems.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <AlertTriangle size={18} className="text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-800 font-medium">{problems.length} накладных требуют проверки: дубли или расхождения</p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            {(["received", "verified", "dispute", "duplicate"] as const).map((s) => (
              <div key={s} className="bg-white border border-[#E5DED2] rounded-lg px-3 py-2 text-center">
                <p className={`text-lg font-bold ${s === "dispute" || s === "duplicate" ? "text-red-600" : "text-[#1E1E1E]"}`}>
                  {invoices.filter(i => i.status === s).length}
                </p>
                <p className="text-xs text-[#8A7E72]">{statusMap[s].label}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E5DED2] text-[#8A7E72] rounded-lg text-sm font-medium hover:bg-[#F7F3EC]">
              <Upload size={16} />
              Из iiko
            </button>
            <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-[#C8A45D] text-white rounded-lg text-sm font-medium hover:bg-[#B8944D]">
              <Plus size={16} />
              Добавить
            </button>
          </div>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl border border-[#C8A45D] p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold text-[#1E1E1E]">Новая накладная</p>
              <button onClick={() => setShowForm(false)}><X size={16} className="text-[#8A7E72]" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Номер накладной *</label>
                <input value={form.number} onChange={e => setForm(p => ({ ...p, number: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30" placeholder="№ накладной" />
              </div>
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Поставщик *</label>
                <input value={form.supplierName} onChange={e => setForm(p => ({ ...p, supplierName: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30" placeholder="Название" />
              </div>
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Дата *</label>
                <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30" />
              </div>
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Сумма по накладной (₸)</label>
                <input type="number" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30" placeholder="0" />
              </div>
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Фактическая сумма (₸)</label>
                <input type="number" value={form.actualAmount} onChange={e => setForm(p => ({ ...p, actualAmount: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30" placeholder="если отличается" />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-[#8A7E72] block mb-1">Примечание</label>
                <input value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30" placeholder="Комментарий" />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={submit} className="px-4 py-2 bg-[#2A2521] text-white rounded-lg text-sm font-medium hover:bg-[#3d3530]">Сохранить</button>
              <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-[#F7F3EC] text-[#8A7E72] rounded-lg text-sm">Отмена</button>
            </div>
          </div>
        )}

        {invoices.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#E5DED2]">
            <EmptyState icon={FileCheck} title="Накладных нет" description="Добавляйте накладные вручную или импортируйте из iiko. Система проверяет на дубли и расхождения." action={{ label: "Добавить накладную", onClick: () => setShowForm(true) }} />
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[#E5DED2] overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#F7F3EC]">
                <tr className="text-xs text-[#8A7E72] uppercase tracking-wide">
                  <th className="text-left px-4 py-3 font-medium">Номер</th>
                  <th className="text-left px-4 py-3 font-medium">Поставщик</th>
                  <th className="text-left px-4 py-3 font-medium">Дата</th>
                  <th className="text-left px-4 py-3 font-medium">Сумма</th>
                  <th className="text-left px-4 py-3 font-medium">Факт</th>
                  <th className="text-left px-4 py-3 font-medium">Статус</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F7F3EC]">
                {invoices.map((inv) => (
                  <tr key={inv.id} className={`hover:bg-[#F7F3EC] transition-colors ${inv.status === "duplicate" || inv.status === "dispute" ? "bg-red-50" : ""}`}>
                    <td className="px-4 py-3 font-mono text-[#1E1E1E]">{inv.number}</td>
                    <td className="px-4 py-3 text-[#1E1E1E]">{inv.supplierName}</td>
                    <td className="px-4 py-3 text-[#8A7E72]">{inv.date}</td>
                    <td className="px-4 py-3 font-semibold text-[#1E1E1E]">{formatMoney(inv.amount)}</td>
                    <td className={`px-4 py-3 ${inv.actualAmount && inv.actualAmount !== inv.amount ? "text-red-600 font-semibold" : "text-[#8A7E72]"}`}>
                      {inv.actualAmount ? formatMoney(inv.actualAmount) : "—"}
                    </td>
                    <td className="px-4 py-3"><Badge variant={statusMap[inv.status].variant}>{statusMap[inv.status].label}</Badge></td>
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
