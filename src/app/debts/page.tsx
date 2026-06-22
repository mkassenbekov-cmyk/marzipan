"use client";
import { PageShell } from "@/components/layout/page-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import { formatMoney } from "@/lib/utils";
import { Receipt, AlertTriangle } from "lucide-react";

const statusMap = {
  current: { label: "Текущий", variant: "neutral" as const },
  overdue: { label: "Просрочен", variant: "danger" as const },
  partial: { label: "Частичная", variant: "warning" as const },
  paid: { label: "Оплачен", variant: "success" as const },
};

export default function DebtsPage() {
  const { debts } = useStore();
  const overdueTotal = debts.filter(d => d.status === "overdue").reduce((s, d) => s + d.overdueAmount, 0);
  const totalDebt = debts.reduce((s, d) => s + d.amount, 0);

  return (
    <PageShell title="Долги заказчиков">
      <div className="space-y-4">
        {debts.filter(d => d.status === "overdue").length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <AlertTriangle size={18} className="text-red-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-800">Просроченная задолженность: {formatMoney(overdueTotal)}</p>
              <p className="text-xs text-red-700 mt-0.5">Требуется немедленный контакт с заказчиками</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white border border-[#E5DED2] rounded-xl p-4">
            <p className="text-xs text-[#8A7E72] uppercase tracking-wide">Всего дебиторка</p>
            <p className="text-xl font-bold text-[#1E1E1E] mt-1">{debts.length > 0 ? formatMoney(totalDebt) : "—"}</p>
          </div>
          <div className="bg-white border border-[#E5DED2] rounded-xl p-4">
            <p className="text-xs text-[#8A7E72] uppercase tracking-wide">Просрочено</p>
            <p className={`text-xl font-bold mt-1 ${overdueTotal > 0 ? "text-red-600" : "text-[#C8C0B4]"}`}>{overdueTotal > 0 ? formatMoney(overdueTotal) : "—"}</p>
          </div>
          <div className="bg-white border border-[#E5DED2] rounded-xl p-4">
            <p className="text-xs text-[#8A7E72] uppercase tracking-wide">Заказчиков с долгом</p>
            <p className="text-xl font-bold text-[#1E1E1E] mt-1">{debts.filter(d => d.amount > 0).length}</p>
          </div>
        </div>

        {debts.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#E5DED2]">
            <EmptyState
              icon={Receipt}
              title="Долгов нет"
              description="Добавьте заказчиков и фиксируйте заказы и оплаты для учёта задолженности"
            />
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[#E5DED2] overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#F7F3EC]">
                <tr className="text-xs text-[#8A7E72] uppercase tracking-wide">
                  <th className="text-left px-4 py-3 font-medium">Заказчик</th>
                  <th className="text-left px-4 py-3 font-medium">Долг</th>
                  <th className="text-left px-4 py-3 font-medium">Просрочено</th>
                  <th className="text-left px-4 py-3 font-medium">Последний заказ</th>
                  <th className="text-left px-4 py-3 font-medium">Статус</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F7F3EC]">
                {debts.map((d) => (
                  <tr key={d.id} className={`hover:bg-[#F7F3EC] transition-colors ${d.status === "overdue" ? "bg-red-50" : ""}`}>
                    <td className="px-4 py-3 font-medium text-[#1E1E1E]">{d.customerName}</td>
                    <td className="px-4 py-3 font-semibold text-[#1E1E1E]">{formatMoney(d.amount)}</td>
                    <td className={`px-4 py-3 font-semibold ${d.overdueAmount > 0 ? "text-red-600" : "text-[#8A7E72]"}`}>
                      {d.overdueAmount > 0 ? formatMoney(d.overdueAmount) : "—"}
                    </td>
                    <td className="px-4 py-3 text-[#8A7E72]">{d.lastOrderDate ?? "—"}</td>
                    <td className="px-4 py-3"><Badge variant={statusMap[d.status].variant}>{statusMap[d.status].label}</Badge></td>
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
