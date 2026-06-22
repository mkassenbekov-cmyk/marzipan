"use client";
import { useState } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import { formatMoney } from "@/lib/utils";
import type { Receipt } from "@/types/business";
import { ArrowDownToLine, Plus, X, AlertTriangle } from "lucide-react";

const statusMap: Record<string, { label: string; variant: "neutral" | "warning" | "success" | "danger" | "accent" }> = {
  pending: { label: "Ожидает", variant: "warning" },
  ok: { label: "ОК", variant: "success" },
  confirmed: { label: "Принят", variant: "success" },
  discrepancy: { label: "Расхождение", variant: "danger" },
};

export default function ReceiptsPage() {
  const { receipts, addReceipt } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ supplierName: "", date: "", receivedBy: "", productName: "", orderedQty: "", receivedQty: "", unit: "кг", price: "" });

  const submit = () => {
    if (!form.supplierName || !form.date) return;
    const item = { productName: form.productName, orderedQty: Number(form.orderedQty), receivedQty: Number(form.receivedQty), unit: form.unit, price: Number(form.price) };
    const hasDiscrepancy = item.orderedQty !== item.receivedQty;
    addReceipt({
      supplierName: form.supplierName,
      date: form.date,
      receivedBy: form.receivedBy,
      items: form.productName ? [item] : [],
      totalAmount: item.price * item.receivedQty,
      status: hasDiscrepancy ? "discrepancy" : "pending",
      discrepancyNote: hasDiscrepancy ? `Заказано ${item.orderedQty}, получено ${item.receivedQty}` : undefined,
    });
    setForm({ supplierName: "", date: "", receivedBy: "", productName: "", orderedQty: "", receivedQty: "", unit: "кг", price: "" });
    setShowForm(false);
  };

  const discrepancies = receipts.filter(r => r.status === "discrepancy");

  return (
    <PageShell title="Приходы товара">
      <div className="space-y-4">
        {discrepancies.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <AlertTriangle size={18} className="text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-800 font-medium">{discrepancies.length} приходов с расхождениями требуют проверки</p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            {(["pending", "confirmed", "discrepancy"] as const).map((s) => (
              <div key={s} className="bg-white border border-[#E5DED2] rounded-lg px-3 py-2 text-center">
                <p className="text-lg font-bold text-[#1E1E1E]">{receipts.filter(r => r.status === s).length}</p>
                <p className="text-xs text-[#8A7E72]">{statusMap[s].label}</p>
              </div>
            ))}
          </div>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-[#C8A45D] text-white rounded-lg text-sm font-medium hover:bg-[#B8944D] transition-colors">
            <Plus size={16} />
            Зафиксировать приход
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl border border-[#C8A45D] p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold text-[#1E1E1E]">Новый приход товара</p>
              <button onClick={() => setShowForm(false)}><X size={16} className="text-[#8A7E72]" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Поставщик *</label>
                <input value={form.supplierName} onChange={e => setForm(p => ({ ...p, supplierName: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30" placeholder="Название поставщика" />
              </div>
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Дата *</label>
                <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30" />
              </div>
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Принял</label>
                <input value={form.receivedBy} onChange={e => setForm(p => ({ ...p, receivedBy: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30" placeholder="Имя сотрудника" />
              </div>
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Товар</label>
                <input value={form.productName} onChange={e => setForm(p => ({ ...p, productName: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30" placeholder="Наименование" />
              </div>
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Заказано</label>
                <input type="number" value={form.orderedQty} onChange={e => setForm(p => ({ ...p, orderedQty: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30" placeholder="0" />
              </div>
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Фактически получено</label>
                <input type="number" value={form.receivedQty} onChange={e => setForm(p => ({ ...p, receivedQty: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30" placeholder="0" />
              </div>
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Ед. изм.</label>
                <select value={form.unit} onChange={e => setForm(p => ({ ...p, unit: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30">
                  <option>кг</option><option>шт</option><option>л</option><option>уп</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Цена за ед. (₸)</label>
                <input type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30" placeholder="0" />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={submit} className="px-4 py-2 bg-[#2A2521] text-white rounded-lg text-sm font-medium hover:bg-[#3d3530]">Сохранить</button>
              <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-[#F7F3EC] text-[#8A7E72] rounded-lg text-sm">Отмена</button>
            </div>
          </div>
        )}

        {receipts.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#E5DED2]">
            <EmptyState
              icon={ArrowDownToLine}
              title="Приходов нет"
              description="Фиксируйте каждое поступление товара: поставщик, количество, цена и фото накладной"
              action={{ label: "Зафиксировать приход", onClick: () => setShowForm(true) }}
            />
          </div>
        ) : (
          <div className="space-y-3">
            {receipts.map((r) => (
              <div key={r.id} className={`bg-white rounded-xl border p-4 ${r.status === "discrepancy" ? "border-red-200" : "border-[#E5DED2]"}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-[#1E1E1E]">{r.supplierName}</p>
                      <Badge variant={statusMap[r.status].variant}>{statusMap[r.status].label}</Badge>
                    </div>
                    <p className="text-xs text-[#8A7E72]">{r.date} · Принял: {r.receivedBy || "—"}</p>
                    {r.discrepancyNote && <p className="text-xs text-red-600 mt-1">⚠ {r.discrepancyNote}</p>}
                  </div>
                  <p className="font-bold text-[#1E1E1E]">{formatMoney(r.totalAmount ?? 0)}</p>
                </div>
                {r.items.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-[#F7F3EC]">
                    {r.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-sm text-[#8A7E72]">
                        <span>{item.productName}</span>
                        <span>{item.receivedQty}/{item.orderedQty} {item.unit} × {formatMoney(item.price)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
