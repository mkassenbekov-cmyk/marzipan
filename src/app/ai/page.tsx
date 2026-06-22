"use client";
import { PageShell } from "@/components/layout/page-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { useStore } from "@/lib/store";
import { Lightbulb, Sparkles, AlertTriangle, TrendingUp, CheckCircle, Scale } from "lucide-react";

export default function AIPage() {
  const { salesData, complaints, writeOffs, tasks, debts, kaspiPayments, invoices, purchaseRequests } = useStore();

  const hasData = salesData.length > 0 || complaints.length > 0 || writeOffs.length > 0 || tasks.length > 0;
  const unmatchedPayments = kaspiPayments.filter(p => p.status === "unmatched").length;
  const overdueDebts = debts.filter(d => d.status === "overdue").length;
  const duplicateInvoices = invoices.filter(i => i.status === "duplicate").length;
  const overdueTasks = tasks.filter(t => t.status === "overdue").length;
  const criticalPurchase = purchaseRequests.filter(r => r.urgency === "critical" && r.status === "new").length;

  const hasAlerts = unmatchedPayments > 0 || overdueDebts > 0 || duplicateInvoices > 0 || overdueTasks > 0 || criticalPurchase > 0;

  return (
    <PageShell title="AI-аналитика">
      <div className="space-y-4">
        {/* Daily report section */}
        <div className="bg-gradient-to-r from-[#2A2521] to-[#3d3530] rounded-xl p-5 text-white">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-[#C8A45D]" />
            <p className="text-xs font-semibold tracking-wide uppercase text-[#C8A45D]">Ежедневный AI-отчёт</p>
          </div>
          {!hasData ? (
            <p className="text-white/60 text-sm leading-5">
              Отчёт будет формироваться автоматически после накопления данных из iiko, WhatsApp и Kaspi Pay.
              <br />
              ИИ проанализирует: продажи, остатки, долги, списания, жалобы, сверки и выдаст рекомендации.
            </p>
          ) : (
            <div className="text-sm text-white/90 leading-6 space-y-1">
              <p>Дата: {new Date().toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" })}</p>
              {hasAlerts && (
                <div className="mt-2 space-y-1">
                  {unmatchedPayments > 0 && <p>⚠ {unmatchedPayments} платежей Kaspi не сопоставлены с заказчиками</p>}
                  {overdueDebts > 0 && <p>⚠ {overdueDebts} заказчиков с просроченной задолженностью</p>}
                  {duplicateInvoices > 0 && <p>⚠ {duplicateInvoices} дублирующихся накладных обнаружено</p>}
                  {overdueTasks > 0 && <p>⚠ {overdueTasks} задач просрочено — требуют внимания</p>}
                  {criticalPurchase > 0 && <p>⚠ {criticalPurchase} критических заявок на закуп не обработаны</p>}
                </div>
              )}
              {!hasAlerts && <p className="text-white/60">Критических отклонений не обнаружено. Все показатели в норме.</p>}
            </div>
          )}
        </div>

        {/* Analysis modules */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[
            {
              icon: Scale,
              title: "Сверка и контроль",
              desc: "Сопоставление накладных, платежей и заказов. Поиск дублей и расхождений.",
              count: duplicateInvoices + unmatchedPayments,
              countLabel: "отклонений",
              href: "/reconciliation",
            },
            {
              icon: AlertTriangle,
              title: "Риски",
              desc: "Просроченные долги, критические остатки, задержки платежей.",
              count: overdueDebts + criticalPurchase,
              countLabel: "рисков",
              href: "/debts",
            },
            {
              icon: TrendingUp,
              title: "Продажи и спад",
              desc: "Анализ динамики продаж по товарам и заказчикам.",
              count: salesData.length,
              countLabel: "записей",
              href: "/sales-decline",
            },
            {
              icon: CheckCircle,
              title: "Задачи и исполнение",
              desc: "Открытые и просроченные задачи по всем отклонениям.",
              count: overdueTasks,
              countLabel: "просрочено",
              href: "/tasks",
            },
          ].map((block) => (
            <a key={block.title} href={block.href} className="block bg-white rounded-xl border border-[#E5DED2] p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F7F3EC] flex items-center justify-center flex-shrink-0">
                  <block.icon size={18} className="text-[#C8A45D]" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[#1E1E1E]">{block.title}</p>
                  <p className="text-xs text-[#8A7E72] mt-0.5 leading-5">{block.desc}</p>
                </div>
                {block.count > 0 ? (
                  <span className="text-2xl font-bold text-red-600">{block.count}</span>
                ) : (
                  <span className="text-sm text-[#C8C0B4]">{block.count} {block.countLabel}</span>
                )}
              </div>
            </a>
          ))}
        </div>

        {!hasData && (
          <div className="bg-white rounded-xl border border-[#E5DED2]">
            <EmptyState
              icon={Lightbulb}
              title="Данных для анализа нет"
              description="ИИ начнёт работу после подключения iiko, добавления заказчиков и фиксации платежей Kaspi Pay"
            />
          </div>
        )}

        {/* What AI will analyse */}
        <div className="bg-white rounded-xl border border-[#E5DED2] p-5">
          <p className="text-sm font-semibold text-[#1E1E1E] mb-3">ИИ анализирует</p>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            {[
              "Остатки и риск нехватки", "Приходы и дубли накладных", "Продажи и спад",
              "Цены и маржинальность", "Платежи Kaspi — сверка", "Долги и просрочки",
              "Списания — повторяемость", "Жалобы и причины", "Бюджет и кассовый разрыв",
              "Заказы vs накладные", "WhatsApp-сообщения", "Задачи и исполнение",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-xs text-[#8A7E72]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C8A45D] flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
