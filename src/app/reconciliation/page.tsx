"use client";
import { PageShell } from "@/components/layout/page-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import { formatMoney } from "@/lib/utils";
import { Scale, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

export default function ReconciliationPage() {
  const { kaspiPayments, invoices, salesData } = useStore();

  const hasData = kaspiPayments.length > 0 || invoices.length > 0;

  const unmatchedPayments = kaspiPayments.filter(p => p.status === "unmatched");
  const duplicatePayments = kaspiPayments.filter(p => p.status === "duplicate");
  const disputeInvoices = invoices.filter(i => i.status === "dispute");
  const duplicateInvoices = invoices.filter(i => i.status === "duplicate");

  const checks = [
    {
      label: "Несопоставленные платежи Kaspi Pay",
      count: unmatchedPayments.length,
      severity: unmatchedPayments.length > 0 ? "warning" : "ok",
      hint: "Платежи без привязки к заказчику или заказу",
    },
    {
      label: "Дубли платежей",
      count: duplicatePayments.length,
      severity: duplicatePayments.length > 0 ? "danger" : "ok",
      hint: "Возможно, один платёж внесён дважды",
    },
    {
      label: "Спорные накладные",
      count: disputeInvoices.length,
      severity: disputeInvoices.length > 0 ? "danger" : "ok",
      hint: "Расхождение по сумме или количеству",
    },
    {
      label: "Дубли накладных",
      count: duplicateInvoices.length,
      severity: duplicateInvoices.length > 0 ? "danger" : "ok",
      hint: "Одна накладная проведена несколько раз",
    },
    {
      label: "Накладные без оплаты",
      count: invoices.filter(i => i.status === "received").length,
      severity: invoices.filter(i => i.status === "received").length > 0 ? "warning" : "ok",
      hint: "Получен товар, но оплата не зафиксирована",
    },
    {
      label: "Заказы без накладных",
      count: 0,
      severity: "ok",
      hint: "Данные для проверки отсутствуют",
    },
  ];

  const problems = checks.filter(c => c.severity !== "ok");

  return (
    <PageShell title="Сверка данных">
      <div className="space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white border border-[#E5DED2] rounded-xl p-4">
            <p className="text-xs text-[#8A7E72] uppercase tracking-wide">Отклонений</p>
            <p className={`text-2xl font-bold mt-1 ${problems.length > 0 ? "text-red-600" : "text-green-600"}`}>{problems.length}</p>
          </div>
          <div className="bg-white border border-[#E5DED2] rounded-xl p-4">
            <p className="text-xs text-[#8A7E72] uppercase tracking-wide">Платежей всего</p>
            <p className="text-2xl font-bold mt-1 text-[#1E1E1E]">{kaspiPayments.length}</p>
          </div>
          <div className="bg-white border border-[#E5DED2] rounded-xl p-4">
            <p className="text-xs text-[#8A7E72] uppercase tracking-wide">Накладных</p>
            <p className="text-2xl font-bold mt-1 text-[#1E1E1E]">{invoices.length}</p>
          </div>
        </div>

        {!hasData ? (
          <div className="bg-white rounded-xl border border-[#E5DED2]">
            <EmptyState
              icon={Scale}
              title="Нет данных для сверки"
              description="Подключите iiko для получения накладных и добавьте платежи Kaspi Pay. Система автоматически проверит их соответствие."
            />
          </div>
        ) : (
          <div className="space-y-3">
            {problems.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-800">Обнаружено {problems.length} отклонений</p>
                  <p className="text-xs text-red-700 mt-1">{problems.map(p => p.label).join(", ")}</p>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl border border-[#E5DED2] overflow-hidden">
              <div className="px-4 py-3 border-b border-[#F7F3EC]">
                <p className="text-sm font-semibold text-[#1E1E1E]">Результаты проверки</p>
              </div>
              <div className="divide-y divide-[#F7F3EC]">
                {checks.map((c) => (
                  <div key={c.label} className={`flex items-center gap-4 px-4 py-3 ${c.severity === "danger" ? "bg-red-50" : c.severity === "warning" ? "bg-yellow-50" : ""}`}>
                    {c.severity === "ok"
                      ? <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" />
                      : <XCircle size={18} className={`flex-shrink-0 ${c.severity === "danger" ? "text-red-500" : "text-yellow-500"}`} />
                    }
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#1E1E1E]">{c.label}</p>
                      <p className="text-xs text-[#8A7E72]">{c.hint}</p>
                    </div>
                    <Badge variant={c.severity === "danger" ? "danger" : c.severity === "warning" ? "warning" : "success"}>
                      {c.count > 0 ? c.count : "ОК"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Instructions when empty */}
        {!hasData && (
          <div className="bg-white rounded-xl border border-[#E5DED2] p-5">
            <p className="text-sm font-semibold text-[#1E1E1E] mb-3">Как настроить сверку</p>
            <div className="space-y-2">
              {[
                "1. Подключите iiko — накладные, заказы и продажи загрузятся автоматически",
                "2. Добавьте платежи Kaspi Pay или загрузите выписку",
                "3. Добавьте заказчиков и привяжите к ним платежи",
                "4. Система автоматически проверит все данные на соответствие",
              ].map((s) => (
                <p key={s} className="text-sm text-[#8A7E72]">{s}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}
