"use client";
import { useState } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import { formatMoney } from "@/lib/utils";
import type { KaspiPayment } from "@/types/business";
import { CreditCard, Plus, Upload, X, AlertTriangle } from "lucide-react";

const statusMap = {
  unmatched: { label: "Не сопост.", variant: "warning" as const },
  matched: { label: "Сопоставлен", variant: "success" as const },
  duplicate: { label: "Дубль", variant: "danger" as const },
  dispute: { label: "Спорный", variant: "danger" as const },
  overpayment: { label: "Переплата", variant: "accent" as const },
  underpayment: { label: "Недоплата", variant: "warning" as const },
};

export default function KaspiPayPage() {
  const { kaspiPayments, addKaspiPayment } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ amount: "", date: "", senderName: "", senderPhone: "", note: "" });

  const unmatched = kaspiPayments.filter(p => p.status === "unmatched");
  const totalToday = kaspiPayments.filter(p => p.date === new Date().toLocaleDateString("ru-RU")).reduce((s, p) => s + p.amount, 0);

  const submit = () => {
    if (!form.amount || !form.date) return;
    addKaspiPayment({
      amount: Number(form.amount),
      date: form.date,
      senderName: form.senderName || undefined,
      senderPhone: form.senderPhone || undefined,
      note: form.note || undefined,
      status: "unmatched",
    });
    setForm({ amount: "", date: "", senderName: "", senderPhone: "", note: "" });
    setShowForm(false);
  };

  return (
    <PageShell title="Kaspi Pay — платежи">
      <div className="space-y-4">
        {unmatched.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
            <AlertTriangle size={18} className="text-yellow-600 flex-shrink-0" />
            <p className="text-sm text-yellow-800 font-medium">{unmatched.length} платежей не сопоставлено с заказчиком или заказом</p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <div className="bg-white border border-[#E5DED2] rounded-xl px-4 py-3">
              <p className="text-xs text-[#8A7E72]">Всего платежей</p>
              <p className="text-xl font-bold text-[#1E1E1E]">{kaspiPayments.length}</p>
            </div>
            <div className="bg-white border border-[#E5DED2] rounded-xl px-4 py-3">
              <p className="text-xs text-[#8A7E72]">Не сопоставлено</p>
              <p className={`text-xl font-bold ${unmatched.length > 0 ? "text-yellow-600" : "text-[#C8C0B4]"}`}>{unmatched.length}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E5DED2] text-[#8A7E72] rounded-lg text-sm font-medium hover:bg-[#F7F3EC] transition-colors">
              <Upload size={16} />
              Импорт выписки
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#C8A45D] text-white rounded-lg text-sm font-medium hover:bg-[#B8944D] transition-colors"
            >
              <Plus size={16} />
              Добавить платёж
            </button>
          </div>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl border border-[#C8A45D] p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold text-[#1E1E1E]">Новый платёж Kaspi Pay</p>
              <button onClick={() => setShowForm(false)}><X size={16} className="text-[#8A7E72]" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Сумма (₸) *</label>
                <input type="number" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30" placeholder="0" />
              </div>
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Дата *</label>
                <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30" />
              </div>
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Отправитель</label>
                <input value={form.senderName} onChange={e => setForm(p => ({ ...p, senderName: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30" placeholder="Имя или компания" />
              </div>
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Телефон</label>
                <input value={form.senderPhone} onChange={e => setForm(p => ({ ...p, senderPhone: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30" placeholder="+7..." />
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

        {kaspiPayments.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#E5DED2]">
            <EmptyState
              icon={CreditCard}
              title="Платежей нет"
              description="Добавьте платежи вручную или загрузите выписку из Kaspi для сверки с заказчиками"
              action={{ label: "Добавить платёж", onClick: () => setShowForm(true) }}
            />
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[#E5DED2] overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#F7F3EC]">
                <tr className="text-xs text-[#8A7E72] uppercase tracking-wide">
                  <th className="text-left px-4 py-3 font-medium">Дата</th>
                  <th className="text-left px-4 py-3 font-medium">Сумма</th>
                  <th className="text-left px-4 py-3 font-medium">Отправитель</th>
                  <th className="text-left px-4 py-3 font-medium">Статус</th>
                  <th className="text-left px-4 py-3 font-medium">Заказчик</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F7F3EC]">
                {kaspiPayments.map((p) => (
                  <tr key={p.id} className={`hover:bg-[#F7F3EC] transition-colors ${p.status === "unmatched" ? "bg-yellow-50" : p.status === "duplicate" ? "bg-red-50" : ""}`}>
                    <td className="px-4 py-3 text-[#8A7E72]">{p.date}</td>
                    <td className="px-4 py-3 font-semibold text-[#1E1E1E]">{formatMoney(p.amount)}</td>
                    <td className="px-4 py-3 text-[#8A7E72]">{p.senderName ?? p.senderPhone ?? "—"}</td>
                    <td className="px-4 py-3"><Badge variant={statusMap[p.status].variant}>{statusMap[p.status].label}</Badge></td>
                    <td className="px-4 py-3 text-[#8A7E72]">{p.linkedCustomerId ? "Привязан" : "—"}</td>
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
