"use client";
import { useState } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { useStore } from "@/lib/store";
import type { Complaint } from "@/types";
import { AlertCircle, Plus, X, ChevronDown } from "lucide-react";

const statusMap: Record<Complaint["status"], { label: string; variant: "danger" | "warning" | "accent" | "neutral" | "success" }> = {
  new: { label: "Новое", variant: "danger" },
  assigned: { label: "Назначено", variant: "warning" },
  in_progress: { label: "В работе", variant: "accent" },
  review: { label: "Проверка", variant: "neutral" },
  closed: { label: "Закрыто", variant: "success" },
  overdue: { label: "Просрочено", variant: "danger" },
};

export default function ComplaintsPage() {
  const { complaints, addComplaint, updateComplaint } = useStore();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ client: "", product: "", reason: "", assignee: "" });

  const submit = () => {
    if (!form.product || !form.reason) return;
    addComplaint({ ...form, status: "new", createdAt: new Date().toLocaleDateString("ru-RU") });
    setForm({ client: "", product: "", reason: "", assignee: "" });
    setShowForm(false);
  };

  return (
    <PageShell title="Жалобы и замечания">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-3 text-xs text-[#8A7E72]">
            {Object.entries(statusMap).map(([k, v]) => (
              <span key={k}>{v.label}: {complaints.filter(c => c.status === k).length}</span>
            ))}
          </div>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-[#C8A45D] text-white rounded-lg text-sm font-medium hover:bg-[#B8944D]">
            <Plus size={16} />
            Новая жалоба
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl border border-[#C8A45D] p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold">Новая жалоба</p>
              <button onClick={() => setShowForm(false)}><X size={16} className="text-[#8A7E72]" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Клиент</label>
                <input value={form.client} onChange={e => setForm(p => ({ ...p, client: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30" placeholder="Имя клиента" />
              </div>
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Продукт *</label>
                <input value={form.product} onChange={e => setForm(p => ({ ...p, product: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30" placeholder="Название продукта" />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-[#8A7E72] block mb-1">Причина *</label>
                <input value={form.reason} onChange={e => setForm(p => ({ ...p, reason: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30" placeholder="Описание проблемы" />
              </div>
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Ответственный</label>
                <input value={form.assignee} onChange={e => setForm(p => ({ ...p, assignee: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30" placeholder="Аскар" />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={submit} className="px-4 py-2 bg-[#2A2521] text-white rounded-lg text-sm font-medium hover:bg-[#3d3530]">Сохранить</button>
              <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-[#F7F3EC] text-[#8A7E72] rounded-lg text-sm">Отмена</button>
            </div>
          </div>
        )}

        {complaints.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#E5DED2]">
            <EmptyState icon={AlertCircle} title="Жалоб нет" description="Фиксируйте жалобы клиентов. Каждая жалоба требует причины и решения перед закрытием." action={{ label: "Зафиксировать жалобу", onClick: () => setShowForm(true) }} />
          </div>
        ) : (
          <div className="space-y-2">
            {complaints.map((c) => (
              <Card key={c.id} onClick={() => setExpanded(expanded === c.id ? null : c.id)}>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-[#8A7E72] font-mono w-8">#{c.id}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1E1E1E]">{c.product}</p>
                    <p className="text-xs text-[#8A7E72]">{c.client} · {c.createdAt}</p>
                  </div>
                  <Badge variant={statusMap[c.status]?.variant ?? "neutral"}>{statusMap[c.status]?.label}</Badge>
                  <ChevronDown size={16} className={`text-[#8A7E72] transition-transform ${expanded === c.id ? "rotate-180" : ""}`} />
                </div>
                {expanded === c.id && (
                  <div className="mt-4 pt-4 border-t border-[#F7F3EC] space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div><span className="text-[#8A7E72]">Причина: </span><span>{c.reason}</span></div>
                      <div><span className="text-[#8A7E72]">Ответственный: </span><span>{c.assignee}</span></div>
                      {c.resolution && <div className="col-span-2"><span className="text-[#8A7E72]">Решение: </span><span>{c.resolution}</span></div>}
                    </div>
                    {c.status !== "closed" && (
                      <button onClick={(e) => { e.stopPropagation(); updateComplaint(c.id, { status: "closed", resolution: "Закрыто вручную" }); }}
                        className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700">
                        Закрыть жалобу
                      </button>
                    )}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
