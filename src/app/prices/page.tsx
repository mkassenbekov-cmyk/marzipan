"use client";
import { useState } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import { formatMoney } from "@/lib/utils";
import type { PriceEntry } from "@/types/business";
import { DollarSign, Plus, X, AlertTriangle } from "lucide-react";

export default function PricesPage() {
  const { customers } = useStore();
  const [prices, setPrices] = useState<PriceEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ productName: "", basePrice: "", costPrice: "", customerId: "", effectiveFrom: "", reason: "", changedBy: "" });

  const submit = () => {
    if (!form.productName || !form.basePrice) return;
    const margin = form.costPrice ? ((Number(form.basePrice) - Number(form.costPrice)) / Number(form.basePrice)) * 100 : undefined;
    const entry: PriceEntry = {
      id: String(Date.now()),
      productName: form.productName,
      basePrice: Number(form.basePrice),
      costPrice: form.costPrice ? Number(form.costPrice) : undefined,
      margin,
      customerId: form.customerId || undefined,
      customerName: form.customerId ? customers.find(c => c.id === form.customerId)?.name : undefined,
      effectiveFrom: form.effectiveFrom || new Date().toLocaleDateString("ru-RU"),
      changedBy: form.changedBy || "—",
      reason: form.reason || undefined,
    };
    setPrices(p => [...p, entry]);
    setForm({ productName: "", basePrice: "", costPrice: "", customerId: "", effectiveFrom: "", reason: "", changedBy: "" });
    setShowForm(false);
  };

  const lowMargin = prices.filter(p => p.margin !== undefined && p.margin < 20);

  return (
    <PageShell title="Цены">
      <div className="space-y-4">
        {lowMargin.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
            <AlertTriangle size={18} className="text-yellow-600 flex-shrink-0" />
            <p className="text-sm text-yellow-800 font-medium">{lowMargin.length} позиций с маржинальностью ниже 20% — требуют пересмотра цены</p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <p className="text-sm text-[#8A7E72]">Базовые и индивидуальные цены по продуктам</p>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-[#C8A45D] text-white rounded-lg text-sm font-medium hover:bg-[#B8944D]">
            <Plus size={16} />
            Добавить цену
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl border border-[#C8A45D] p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold text-[#1E1E1E]">Новая цена</p>
              <button onClick={() => setShowForm(false)}><X size={16} className="text-[#8A7E72]" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Товар *</label>
                <input value={form.productName} onChange={e => setForm(p => ({ ...p, productName: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30" placeholder="Бейгл с лососем" />
              </div>
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Цена продажи (₸) *</label>
                <input type="number" value={form.basePrice} onChange={e => setForm(p => ({ ...p, basePrice: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30" placeholder="0" />
              </div>
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Себестоимость (₸)</label>
                <input type="number" value={form.costPrice} onChange={e => setForm(p => ({ ...p, costPrice: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30" placeholder="0" />
              </div>
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Заказчик (если индивид.)</label>
                <select value={form.customerId} onChange={e => setForm(p => ({ ...p, customerId: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30">
                  <option value="">Базовая цена</option>
                  {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Действует с</label>
                <input type="date" value={form.effectiveFrom} onChange={e => setForm(p => ({ ...p, effectiveFrom: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30" />
              </div>
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Кто изменил</label>
                <input value={form.changedBy} onChange={e => setForm(p => ({ ...p, changedBy: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30" placeholder="Имя" />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-[#8A7E72] block mb-1">Причина изменения</label>
                <input value={form.reason} onChange={e => setForm(p => ({ ...p, reason: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30" placeholder="Рост себестоимости, договорённость..." />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={submit} className="px-4 py-2 bg-[#2A2521] text-white rounded-lg text-sm font-medium hover:bg-[#3d3530]">Сохранить</button>
              <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-[#F7F3EC] text-[#8A7E72] rounded-lg text-sm">Отмена</button>
            </div>
          </div>
        )}

        {prices.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#E5DED2]">
            <EmptyState icon={DollarSign} title="Цен нет" description="Добавьте базовые и индивидуальные цены. Система отслеживает маржинальность и сигнализирует при падении ниже допустимого уровня." action={{ label: "Добавить цену", onClick: () => setShowForm(true) }} />
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[#E5DED2] overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#F7F3EC]">
                <tr className="text-xs text-[#8A7E72] uppercase tracking-wide">
                  <th className="text-left px-4 py-3 font-medium">Товар</th>
                  <th className="text-left px-4 py-3 font-medium">Цена</th>
                  <th className="text-left px-4 py-3 font-medium">Себест.</th>
                  <th className="text-left px-4 py-3 font-medium">Маржа</th>
                  <th className="text-left px-4 py-3 font-medium">Заказчик</th>
                  <th className="text-left px-4 py-3 font-medium">С</th>
                  <th className="text-left px-4 py-3 font-medium">Причина</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F7F3EC]">
                {prices.map((p) => (
                  <tr key={p.id} className={`hover:bg-[#F7F3EC] ${p.margin !== undefined && p.margin < 20 ? "bg-yellow-50" : ""}`}>
                    <td className="px-4 py-3 font-medium text-[#1E1E1E]">{p.productName}</td>
                    <td className="px-4 py-3 font-semibold text-[#1E1E1E]">{formatMoney(p.basePrice ?? p.price ?? 0)}</td>
                    <td className="px-4 py-3 text-[#8A7E72]">{p.costPrice ? formatMoney(p.costPrice) : "—"}</td>
                    <td className="px-4 py-3">
                      {p.margin !== undefined ? (
                        <Badge variant={p.margin < 20 ? "danger" : p.margin < 35 ? "warning" : "success"}>{p.margin.toFixed(0)}%</Badge>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-3 text-[#8A7E72]">{p.customerName ?? "Базовая"}</td>
                    <td className="px-4 py-3 text-[#8A7E72]">{p.effectiveFrom}</td>
                    <td className="px-4 py-3 text-[#8A7E72] max-w-[150px] truncate">{p.reason ?? "—"}</td>
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
