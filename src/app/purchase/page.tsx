"use client";
import { useState } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import type { PurchaseRequest } from "@/types";
import { ShoppingCart, Plus, X, CheckCircle } from "lucide-react";

const urgencyMap = { critical: { label: "Критично", variant: "danger" as const }, high: { label: "Срочно", variant: "warning" as const }, normal: { label: "Норм.", variant: "neutral" as const } };
const statusMap = { new: { label: "Новая", variant: "neutral" as const }, approved: { label: "Одобрено", variant: "success" as const }, ordered: { label: "Заказано", variant: "accent" as const }, received: { label: "Получено", variant: "success" as const } };

export default function PurchasePage() {
  const { purchaseRequests, addPurchaseRequest } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [reqs, setReqs] = useState(purchaseRequests);
  const [form, setForm] = useState({ product: "", quantity: "", unit: "кг", urgency: "normal" as PurchaseRequest["urgency"], zone: "", requestedBy: "", neededBy: "" });

  const submit = () => {
    if (!form.product || !form.quantity) return;
    addPurchaseRequest({ ...form, status: "new" });
    setForm({ product: "", quantity: "", unit: "кг", urgency: "normal", zone: "", requestedBy: "", neededBy: "" });
    setShowForm(false);
  };

  const allReqs = [...purchaseRequests];

  return (
    <PageShell title="Закуп и заявки">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            {(["new", "approved", "ordered", "received"] as const).map((s) => (
              <div key={s} className="bg-white border border-[#E5DED2] rounded-lg px-3 py-2 text-center">
                <p className="text-lg font-bold text-[#1E1E1E]">{allReqs.filter(r => r.status === s).length}</p>
                <p className="text-xs text-[#8A7E72]">{statusMap[s].label}</p>
              </div>
            ))}
          </div>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-[#C8A45D] text-white rounded-lg text-sm font-medium hover:bg-[#B8944D]">
            <Plus size={16} />
            Новая заявка
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl border border-[#C8A45D] p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold">Заявка на закуп</p>
              <button onClick={() => setShowForm(false)}><X size={16} className="text-[#8A7E72]" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Товар *</label>
                <input value={form.product} onChange={e => setForm(p => ({ ...p, product: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30" placeholder="Наименование" />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-xs text-[#8A7E72] block mb-1">Количество *</label>
                  <input type="number" value={form.quantity} onChange={e => setForm(p => ({ ...p, quantity: e.target.value }))}
                    className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30" placeholder="0" />
                </div>
                <div className="w-20">
                  <label className="text-xs text-[#8A7E72] block mb-1">Ед.</label>
                  <select value={form.unit} onChange={e => setForm(p => ({ ...p, unit: e.target.value }))}
                    className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30">
                    <option>кг</option><option>шт</option><option>л</option><option>уп</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Срочность</label>
                <select value={form.urgency} onChange={e => setForm(p => ({ ...p, urgency: e.target.value as PurchaseRequest["urgency"] }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30">
                  <option value="critical">Критично</option><option value="high">Срочно</option><option value="normal">Норм.</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Нужно к</label>
                <input type="date" value={form.neededBy} onChange={e => setForm(p => ({ ...p, neededBy: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30" />
              </div>
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Зона</label>
                <input value={form.zone} onChange={e => setForm(p => ({ ...p, zone: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30" placeholder="Заготовки / Пекарня..." />
              </div>
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Кто подал</label>
                <input value={form.requestedBy} onChange={e => setForm(p => ({ ...p, requestedBy: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30" placeholder="Имя" />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={submit} className="px-4 py-2 bg-[#2A2521] text-white rounded-lg text-sm font-medium hover:bg-[#3d3530]">Создать заявку</button>
              <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-[#F7F3EC] text-[#8A7E72] rounded-lg text-sm">Отмена</button>
            </div>
          </div>
        )}

        {allReqs.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#E5DED2]">
            <EmptyState icon={ShoppingCart} title="Заявок нет" description="Подавайте заявки на закуп по зонам: заготовки, пекарня, сборка, хозтовары" action={{ label: "Создать заявку", onClick: () => setShowForm(true) }} />
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[#E5DED2] overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#F7F3EC]">
                <tr className="text-xs text-[#8A7E72] uppercase tracking-wide">
                  <th className="text-left px-4 py-3 font-medium">Товар</th>
                  <th className="text-left px-4 py-3 font-medium">Кол-во</th>
                  <th className="text-left px-4 py-3 font-medium">Зона</th>
                  <th className="text-left px-4 py-3 font-medium">Кто подал</th>
                  <th className="text-left px-4 py-3 font-medium">Нужно к</th>
                  <th className="text-left px-4 py-3 font-medium">Срочность</th>
                  <th className="text-left px-4 py-3 font-medium">Статус</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F7F3EC]">
                {allReqs.map((r) => (
                  <tr key={r.id} className={`hover:bg-[#F7F3EC] transition-colors ${r.urgency === "critical" ? "bg-red-50" : ""}`}>
                    <td className="px-4 py-3 font-medium text-[#1E1E1E]">{r.product}</td>
                    <td className="px-4 py-3 text-[#8A7E72]">{r.quantity} {r.unit}</td>
                    <td className="px-4 py-3 text-[#8A7E72]">{r.zone || "—"}</td>
                    <td className="px-4 py-3 text-[#8A7E72]">{r.requestedBy || "—"}</td>
                    <td className="px-4 py-3 text-[#8A7E72]">{r.neededBy || "—"}</td>
                    <td className="px-4 py-3"><Badge variant={urgencyMap[r.urgency].variant}>{urgencyMap[r.urgency].label}</Badge></td>
                    <td className="px-4 py-3"><Badge variant={statusMap[r.status].variant}>{statusMap[r.status].label}</Badge></td>
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
