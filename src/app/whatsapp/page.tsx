"use client";
import { useState } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import type { WhatsAppMessage } from "@/types/business";
import { MessageCircle, Plus, X, AlertTriangle } from "lucide-react";

const typeLabel: Record<WhatsAppMessage["type"], string> = {
  order: "Заказ", payment: "Оплата", invoice: "Накладная", complaint: "Жалоба",
  stock: "Остаток", report: "Отчёт", unknown: "Неизвестно",
};
const statusMap = {
  new: { label: "Новое", variant: "accent" as const },
  processed: { label: "Обработано", variant: "success" as const },
  error: { label: "Ошибка", variant: "danger" as const },
  duplicate: { label: "Дубль", variant: "warning" as const },
  conflict: { label: "Конфликт", variant: "danger" as const },
  needs_confirm: { label: "Нужно подтвердить", variant: "warning" as const },
  unrecognized: { label: "Не распознано", variant: "neutral" as const },
};

export default function WhatsAppPage() {
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ sender: "", phone: "", text: "", type: "unknown" as WhatsAppMessage["type"] });

  const problems = messages.filter(m => m.status !== "processed");

  const submit = () => {
    if (!form.sender || !form.text) return;
    const newMsg: WhatsAppMessage = {
      id: String(Date.now()), ...form,
      timestamp: new Date().toLocaleString("ru-RU"),
      status: "new",
    };
    setMessages(p => [...p, newMsg]);
    setForm({ sender: "", phone: "", text: "", type: "unknown" });
    setShowForm(false);
  };

  return (
    <PageShell title="WhatsApp — обработка сообщений">
      <div className="space-y-4">
        {problems.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
            <AlertTriangle size={18} className="text-yellow-600 flex-shrink-0" />
            <p className="text-sm text-yellow-800 font-medium">{problems.length} сообщений требуют проверки или обработки</p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            {(["new", "processed", "error", "duplicate", "needs_confirm"] as const).map((s) => (
              <div key={s} className="bg-white border border-[#E5DED2] rounded-lg px-3 py-2 text-center min-w-[64px]">
                <p className="text-lg font-bold text-[#1E1E1E]">{messages.filter(m => m.status === s).length}</p>
                <p className="text-[10px] text-[#8A7E72]">{statusMap[s].label}</p>
              </div>
            ))}
          </div>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-[#C8A45D] text-white rounded-lg text-sm font-medium hover:bg-[#B8944D]">
            <Plus size={16} />
            Добавить сообщение
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl border border-[#C8A45D] p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold text-[#1E1E1E]">Новое сообщение из WhatsApp</p>
              <button onClick={() => setShowForm(false)}><X size={16} className="text-[#8A7E72]" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Отправитель *</label>
                <input value={form.sender} onChange={e => setForm(p => ({ ...p, sender: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30" placeholder="Имя / контакт" />
              </div>
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Тип сообщения</label>
                <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as WhatsAppMessage["type"] }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30">
                  {Object.entries(typeLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-xs text-[#8A7E72] block mb-1">Текст сообщения *</label>
                <textarea value={form.text} onChange={e => setForm(p => ({ ...p, text: e.target.value }))} rows={3}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30 resize-none" placeholder="Вставьте текст сообщения..." />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={submit} className="px-4 py-2 bg-[#2A2521] text-white rounded-lg text-sm font-medium hover:bg-[#3d3530]">Сохранить</button>
              <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-[#F7F3EC] text-[#8A7E72] rounded-lg text-sm">Отмена</button>
            </div>
          </div>
        )}

        {messages.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#E5DED2]">
            <EmptyState
              icon={MessageCircle}
              title="Сообщений нет"
              description="Фиксируйте заказы, оплаты, накладные и жалобы из WhatsApp. Система проверяет их на полноту, дубли и соответствие данным из iiko."
              action={{ label: "Добавить сообщение", onClick: () => setShowForm(true) }}
            />
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((m) => (
              <div key={m.id} className={`bg-white rounded-xl border p-4 ${m.status === "error" || m.status === "conflict" ? "border-red-200" : m.status === "duplicate" || m.status === "needs_confirm" ? "border-yellow-200" : "border-[#E5DED2]"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-[#1E1E1E] text-sm">{m.sender}</p>
                      <Badge variant="neutral">{typeLabel[m.type]}</Badge>
                      <Badge variant={statusMap[m.status].variant}>{statusMap[m.status].label}</Badge>
                    </div>
                    <p className="text-sm text-[#8A7E72] line-clamp-2">{m.text}</p>
                    {m.errorDetail && <p className="text-xs text-red-600 mt-1">⚠ {m.errorDetail}</p>}
                  </div>
                  <span className="text-xs text-[#C8C0B4] flex-shrink-0">{m.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
