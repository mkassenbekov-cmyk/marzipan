"use client";
import { useState } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { useStore } from "@/lib/store";
import type { Customer } from "@/types/business";
import { UserCheck, Plus, X, Phone, MapPin } from "lucide-react";

const statusLabel = { active: "Активный", inactive: "Неактивный", risk: "Под риском" };
const statusVariant = { active: "success", inactive: "neutral", risk: "danger" } as const;

export default function CustomersPage() {
  const { customers, addCustomer } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", address: "", note: "" });

  const submit = () => {
    if (!form.name) return;
    addCustomer({ ...form, status: "active", createdAt: new Date().toLocaleDateString("ru-RU") });
    setForm({ name: "", phone: "", address: "", note: "" });
    setShowForm(false);
  };

  return (
    <PageShell title="Заказчики">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            {(["active", "inactive", "risk"] as const).map((s) => (
              <div key={s} className="bg-white border border-[#E5DED2] rounded-lg px-3 py-2 text-center">
                <p className="text-lg font-bold text-[#1E1E1E]">{customers.filter(c => c.status === s).length}</p>
                <p className="text-xs text-[#8A7E72]">{statusLabel[s]}</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#C8A45D] text-white rounded-lg text-sm font-medium hover:bg-[#B8944D] transition-colors"
          >
            <Plus size={16} />
            Добавить заказчика
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl border border-[#C8A45D] p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold text-[#1E1E1E]">Новый заказчик</p>
              <button onClick={() => setShowForm(false)}><X size={16} className="text-[#8A7E72]" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-xs text-[#8A7E72] block mb-1">Название / Имя *</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30" placeholder="ИП Иванов / Café Blossom" />
              </div>
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Телефон</label>
                <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30" placeholder="+7 7XX XXX XX XX" />
              </div>
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Адрес доставки</label>
                <input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30" placeholder="ул. Абая 10" />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-[#8A7E72] block mb-1">Примечание</label>
                <input value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30" placeholder="Особые условия, скидки..." />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={submit} className="px-4 py-2 bg-[#2A2521] text-white rounded-lg text-sm font-medium hover:bg-[#3d3530]">Сохранить</button>
              <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-[#F7F3EC] text-[#8A7E72] rounded-lg text-sm">Отмена</button>
            </div>
          </div>
        )}

        {customers.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#E5DED2]">
            <EmptyState
              icon={UserCheck}
              title="Заказчиков нет"
              description="Добавьте заказчиков для учёта заказов, долгов и истории продаж"
              action={{ label: "Добавить заказчика", onClick: () => setShowForm(true) }}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {customers.map((c) => (
              <div key={c.id} className="bg-white rounded-xl border border-[#E5DED2] p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-[#1E1E1E]">{c.name}</p>
                      <Badge variant={c.status ? (statusVariant[c.status] ?? "neutral") : "neutral"}>{c.status ? statusLabel[c.status] : "—"}</Badge>
                    </div>
                    {c.phone && <div className="flex items-center gap-1.5 mt-1.5 text-xs text-[#8A7E72]"><Phone size={11} />{c.phone}</div>}
                    {c.address && <div className="flex items-center gap-1.5 mt-1 text-xs text-[#8A7E72]"><MapPin size={11} />{c.address}</div>}
                    {c.note && <p className="text-xs text-[#8A7E72] mt-1 italic">{c.note}</p>}
                  </div>
                  <p className="text-xs text-[#C8C0B4]">{c.createdAt}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
