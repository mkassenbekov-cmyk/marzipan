"use client";
import { useStore } from "@/lib/store";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { formatMoney } from "@/lib/utils";
import {
  TrendingUp, CreditCard, DollarSign, AlertCircle, Trash2,
  CheckSquare, Lightbulb, Scale, Receipt, TrendingDown, ArrowRight
} from "lucide-react";
import Link from "next/link";

export function OwnerDashboard() {
  const { salesData, complaints, writeOffs, tasks, debts, kaspiPayments, aiRecommendations } = useStore();

  const todayRevenue = salesData.reduce((s, d) => s + d.revenue, 0);
  const todayKaspi = kaspiPayments.filter(p => p.status !== "duplicate").reduce((s, p) => s + p.amount, 0);
  const overdueDebts = debts.filter(d => d.status === "overdue").reduce((s, d) => s + (d.overdueAmount ?? 0), 0);
  const openComplaints = complaints.filter(c => c.status !== "closed").length;
  const unmatchedPayments = kaspiPayments.filter(p => p.status === "unmatched").length;
  const openTasks = tasks.filter(t => t.status !== "done").length;
  const overdueTasks = tasks.filter(t => t.status === "overdue").length;

  const isEmpty = salesData.length === 0 && complaints.length === 0 && tasks.length === 0;

  return (
    <div className="space-y-5">
      {/* Setup banner — shown when no data */}
      {isEmpty && (
        <div className="bg-gradient-to-r from-[#2A2521] to-[#3d3530] rounded-xl p-5 text-white">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#C8A45D]/20 flex items-center justify-center flex-shrink-0">
              <Lightbulb size={20} className="text-[#C8A45D]" />
            </div>
            <div>
              <p className="font-semibold text-white">Добро пожаловать в MARZIPAN OS</p>
              <p className="text-white/60 text-sm mt-1 leading-5">
                Платформа запущена. Данных пока нет. Начните с подключения iiko и импорта продаж,
                добавьте заказчиков, загрузите накладные и настройте Kaspi Pay.
              </p>
              <div className="flex gap-2 mt-3 flex-wrap">
                <Link href="/iiko" className="px-3 py-1.5 bg-[#C8A45D] text-white rounded-lg text-xs font-medium hover:bg-[#B8944D] transition-colors">
                  Подключить iiko
                </Link>
                <Link href="/customers" className="px-3 py-1.5 bg-white/10 text-white rounded-lg text-xs font-medium hover:bg-white/20 transition-colors">
                  Добавить заказчиков
                </Link>
                <Link href="/kaspi-pay" className="px-3 py-1.5 bg-white/10 text-white rounded-lg text-xs font-medium hover:bg-white/20 transition-colors">
                  Настроить Kaspi Pay
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard
          label="Выручка сегодня"
          value={todayRevenue > 0 ? formatMoney(todayRevenue) : "—"}
          icon={TrendingUp}
          href="/sales"
          empty={todayRevenue === 0}
          emptyHint="Нет данных о продажах"
        />
        <KpiCard
          label="Kaspi Pay"
          value={todayKaspi > 0 ? formatMoney(todayKaspi) : "—"}
          icon={CreditCard}
          href="/kaspi-pay"
          empty={todayKaspi === 0}
          emptyHint="Нет платежей"
          alert={unmatchedPayments > 0 ? `${unmatchedPayments} не сопоставлено` : undefined}
        />
        <KpiCard
          label="Дебиторка"
          value={overdueDebts > 0 ? formatMoney(overdueDebts) : "—"}
          icon={Receipt}
          href="/debts"
          empty={debts.length === 0}
          emptyHint="Нет заказчиков"
          alertLevel={overdueDebts > 0 ? "danger" : undefined}
        />
        <KpiCard
          label="Задачи"
          value={openTasks > 0 ? String(openTasks) : "—"}
          icon={CheckSquare}
          href="/tasks"
          empty={tasks.length === 0}
          emptyHint="Задач нет"
          alert={overdueTasks > 0 ? `${overdueTasks} просрочено` : undefined}
          alertLevel={overdueTasks > 0 ? "danger" : undefined}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Сверка */}
        <Card>
          <CardHeader>
            <CardTitle>Сверка данных</CardTitle>
            <Link href="/reconciliation" className="text-xs text-[#C8A45D] hover:underline flex items-center gap-1">Открыть <ArrowRight size={11} /></Link>
          </CardHeader>
          {isEmpty ? (
            <EmptyState
              icon={Scale}
              title="Нет данных для сверки"
              description="Подключите iiko и Kaspi Pay для автоматической сверки накладных и оплат"
              className="py-8"
            />
          ) : (
            <ReconciliationSummary unmatchedPayments={unmatchedPayments} />
          )}
        </Card>

        {/* Долги */}
        <Card>
          <CardHeader>
            <CardTitle>Долги заказчиков</CardTitle>
            <Link href="/debts" className="text-xs text-[#C8A45D] hover:underline flex items-center gap-1">Все <ArrowRight size={11} /></Link>
          </CardHeader>
          {debts.length === 0 ? (
            <EmptyState
              icon={Receipt}
              title="Заказчиков нет"
              description="Добавьте заказчиков и зафиксируйте заказы для учёта задолженности"
              className="py-8"
            />
          ) : (
            <div className="space-y-2">
              {debts.slice(0, 5).map((d) => (
                <div key={d.id} className="flex items-center justify-between text-sm">
                  <span className="text-[#1E1E1E] truncate max-w-[140px]">{d.customerName}</span>
                  <Badge variant={d.status === "overdue" ? "danger" : d.status === "partial" ? "warning" : "neutral"}>
                    {formatMoney(d.amount)}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Спад продаж */}
        <Card>
          <CardHeader>
            <CardTitle>Спад продаж</CardTitle>
            <Link href="/sales-decline" className="text-xs text-[#C8A45D] hover:underline flex items-center gap-1">Анализ <ArrowRight size={11} /></Link>
          </CardHeader>
          {salesData.length === 0 ? (
            <EmptyState
              icon={TrendingDown}
              title="Нет данных"
              description="Импортируйте продажи из iiko для анализа динамики"
              className="py-8"
            />
          ) : null}
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* AI */}
        <Card>
          <CardHeader>
            <CardTitle>AI-аналитика</CardTitle>
            <Link href="/ai" className="text-xs text-[#C8A45D] hover:underline flex items-center gap-1">Все <ArrowRight size={11} /></Link>
          </CardHeader>
          {aiRecommendations.length === 0 ? (
            <EmptyState
              icon={Lightbulb}
              title="Рекомендаций пока нет"
              description="После заполнения данных ИИ начнёт формировать ежедневные рекомендации"
              className="py-8"
            />
          ) : (
            <div className="space-y-2">
              {aiRecommendations.slice(0, 4).map((r) => (
                <div key={r.id} className="p-3 bg-[#F7F3EC] rounded-lg">
                  <p className="text-sm font-medium text-[#1E1E1E]">{r.title}</p>
                  <p className="text-xs text-[#8A7E72] mt-0.5 line-clamp-2">{r.body}</p>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Задачи + жалобы */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Задачи</CardTitle>
              <Link href="/tasks" className="text-xs text-[#C8A45D] hover:underline flex items-center gap-1">Все <ArrowRight size={11} /></Link>
            </CardHeader>
            {tasks.length === 0 ? (
              <EmptyState icon={CheckSquare} title="Задач нет" description="Задачи появятся по мере работы системы" className="py-6" />
            ) : (
              <div className="space-y-1">
                {tasks.slice(0, 4).map((t) => (
                  <div key={t.id} className="flex items-center gap-2 py-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${t.priority === "high" ? "bg-red-500" : t.priority === "medium" ? "bg-yellow-500" : "bg-green-500"}`} />
                    <p className="text-sm text-[#1E1E1E] flex-1 truncate">{t.title}</p>
                    <span className="text-xs text-[#8A7E72]">{t.dueDate}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Жалобы</CardTitle>
              <Link href="/complaints" className="text-xs text-[#C8A45D] hover:underline flex items-center gap-1">Все <ArrowRight size={11} /></Link>
            </CardHeader>
            {complaints.length === 0 ? (
              <EmptyState icon={AlertCircle} title="Жалоб нет" description="" className="py-5" />
            ) : (
              <div className="space-y-1">
                {complaints.slice(0, 3).map((c) => (
                  <div key={c.id} className="flex items-center justify-between py-1">
                    <p className="text-sm text-[#1E1E1E] truncate">{c.product}</p>
                    <Badge variant={c.status === "overdue" ? "danger" : "warning"}>{c.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, icon: Icon, href, empty, emptyHint, alert, alertLevel }: {
  label: string; value: string; icon: React.ElementType; href: string;
  empty?: boolean; emptyHint?: string; alert?: string; alertLevel?: "danger" | "warning";
}) {
  return (
    <Link href={href} className="block bg-white rounded-xl border border-[#E5DED2] p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-semibold text-[#8A7E72] uppercase tracking-wide">{label}</p>
          <p className={`text-xl font-bold mt-1 ${empty ? "text-[#C8C0B4]" : "text-[#1E1E1E]"}`}>{value}</p>
          {empty && emptyHint && <p className="text-[10px] text-[#C8C0B4] mt-0.5">{emptyHint}</p>}
          {alert && (
            <p className={`text-[10px] font-medium mt-1 ${alertLevel === "danger" ? "text-red-600" : "text-yellow-600"}`}>
              ⚠ {alert}
            </p>
          )}
        </div>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${empty ? "bg-[#F7F3EC]" : "bg-[#C8A45D]/10"}`}>
          <Icon size={16} className={empty ? "text-[#C8C0B4]" : "text-[#C8A45D]"} />
        </div>
      </div>
    </Link>
  );
}

function ReconciliationSummary({ unmatchedPayments }: { unmatchedPayments: number }) {
  return (
    <div className="space-y-2 text-sm">
      <div className="flex items-center justify-between p-2 bg-[#F7F3EC] rounded-lg">
        <span className="text-[#8A7E72]">Несопоставленные оплаты</span>
        <Badge variant={unmatchedPayments > 0 ? "warning" : "success"}>{unmatchedPayments}</Badge>
      </div>
    </div>
  );
}
