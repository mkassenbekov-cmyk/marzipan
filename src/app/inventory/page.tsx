"use client";
import { useState } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { Archive, Plus, X } from "lucide-react";

interface StockItem { id: string; product: string; stock: number; minStock: number; unit: string; status: "critical" | "warning" | "ok"; }

export default function InventoryPage() {
  const [items, setItems] = useState<StockItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ product: "", stock: "", minStock: "", unit: "кг" });

  const submit = () => {
    if (!form.product || !form.stock) return;
    const stock = Number(form.stock), min = Number(form.minStock);
    const status: StockItem["status"] = stock <= min * 0.3 ? "critical" : stock <= min ? "warning" : "ok";
    setItems(p => [...p, { id: String(Date.now()), product: form.product, stock, minStock: min, unit: form.unit, status }]);
    setForm({ product: "", stock: "", minStock: "", unit: "кг" });
    setShowForm(false);
  };

  const critical = items.filter(i => i.status === "critical");

  return (
    <PageShell title="Остатки">
      <div className="space-y-4">
        {critical.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-red-800">Критические остатки: {critical.map(i => i.product).join(", ")}</p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            {([["critical", "Критично"], ["warning", "Мало"], ["ok", "Норма"]] as const).map(([s, l]) => (
              <div key={s} className="bg-white border border-[#E5DED2] rounded-lg px-3 py-2">
                <p className="text-lg font-bold text-[#1E1E1E]">{items.filter(i => i.status === s).length}</p>
                <p className="text-xs text-[#8A7E72]">{l}</p>
              </div>
            ))}
          </div>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-[#C8A45D] text-white rounded-lg text-sm font-medium hover:bg-[#B8944D]">
            <Plus size={16} />
            Добавить позицию
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl border border-[#C8A45D] p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold">Новая позиция</p>
              <button onClick={() => setShowForm(false)}><X size={16} className="text-[#8A7E72]" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Товар *</label>
                <input value={form.product} onChange={e => setForm(p => ({ ...p, product: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30" placeholder="Авокадо" />
              </div>
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Ед. изм.</label>
                <select value={form.unit} onChange={e => setForm(p => ({ ...p, unit: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30">
                  <option>кг</option><option>шт</option><option>л</option><option>уп</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Текущий остаток *</label>
                <input type="number" value={form.stock} onChange={e => setForm(p => ({ ...p, stock: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30" placeholder="0" />
              </div>
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Минимальный остаток</label>
                <input type="number" value={form.minStock} onChange={e => setForm(p => ({ ...p, minStock: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30" placeholder="0" />
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
            <EmptyState icon={Archive} title="Остатков нет" description="Добавьте позиции вручную или импортируйте из iiko. Система подсветит критические остатки и риски нехватки." action={{ label: "Добавить позицию", onClick: () => setShowForm(true) }} />
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[#E5DED2] overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#F7F3EC]">
                <tr className="text-xs text-[#8A7E72] uppercase tracking-wide">
                  <th className="text-left px-4 py-3 font-medium">Товар</th>
                  <th className="text-left px-4 py-3 font-medium">Остаток</th>
                  <th className="text-left px-4 py-3 font-medium">Мин. норма</th>
                  <th className="text-left px-4 py-3 font-medium">Статус</th>
                  <th className="text-left px-4 py-3 font-medium">Прогресс</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F7F3EC]">
                {items.map((item) => {
                  const pct = item.minStock > 0 ? Math.min(100, (item.stock / item.minStock) * 100) : 100;
                  return (
                    <tr key={item.id} className="hover:bg-[#F7F3EC]">
                      <td className="px-4 py-3 font-medium text-[#1E1E1E]">{item.product}</td>
                      <td className="px-4 py-3 font-mono text-[#1E1E1E]">{item.stock} {item.unit}</td>
                      <td className="px-4 py-3 text-[#8A7E72]">{item.minStock > 0 ? `${item.minStock} ${item.unit}` : "—"}</td>
                      <td className="px-4 py-3">
                        <Badge variant={item.status === "critical" ? "danger" : item.status === "warning" ? "warning" : "success"}>
                          {item.status === "critical" ? "Критично" : item.status === "warning" ? "Мало" : "Норма"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="w-32">
                          <div className="w-full bg-[#F7F3EC] rounded-full h-1.5">
                            <div className={`h-1.5 rounded-full ${item.status === "critical" ? "bg-red-400" : item.status === "warning" ? "bg-yellow-400" : "bg-green-400"}`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageShell>
  );
}
