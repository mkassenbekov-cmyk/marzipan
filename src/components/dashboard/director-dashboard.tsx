"use client";
import { useStore } from "@/lib/store";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { formatMoney } from "@/lib/utils";
import { Clock, CheckSquare, AlertCircle, Trash2, TrendingDown, Scale, Lightbulb, ArrowRight } from "lucide-react";
import Link from "next/link";

export function DirectorDashboard() {
  const { shifts, tasks, complaints, writeOffs, debts, salesData } = useStore();

  const lateShifts = shifts.filter(s => s.late && s.late > 0);
  const overdueTasks = tasks.filter(t => t.status === "overdue");
  const openComplaints = complaints.filter(c => c.status !== "closed");
  const totalWriteoffs = writeOffs.reduce((s, w) => s + w.amount, 0);
  const overdueDebts = debts.filter(d => d.status === "overdue");

  const isEmpty = shifts.length === 0 && tasks.length === 0 && salesData.length === 0;

  return (
    <div className="space-y-5">
      {isEmpty && (
        <div className="bg-gradient-to-r from-[#2A2521] to-[#3d3530] rounded-xl p-5 text-white">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#C8A45D]/20 flex items-center justify-center flex-shrink-0">
              <Lightbulb size={20} className="text-[#C8A45D]" />
            </div>
            <div>
              <p className="font-semibold">Операционный центр</p>
              <p className="text-white/60 text-sm mt-1">Данных пока нет. Начните с смен, добавьте задачи Аскару и подключите iiko для аналитики продаж.</p>
              <div className="flex gap-2 mt-3">
                <Link href="/shifts" className="px-3 py-1.5 bg-[#C8A45D] text-white rounded-lg text-xs font-medium hover:bg-[#B8944D]">Смены</Link>
                <Link href="/tasks" className="px-3 py-1.5 bg-white/10 text-white rounded-lg text-xs font-medium hover:bg-white/20">Задачи</Link>
                <Link href="/sales-decline" className="px-3 py-1.5 bg-white/10 text-white rounded-lg text-xs font-medium hover:bg-white/20">Спад продаж</Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Опозданий", value: lateShifts.length, alert: lateShifts.length > 0, href: "/shifts" },
          { label: "Просроч. задач", value: overdueTasks.length, alert: overdueTasks.length > 0, href: "/tasks" },
          { label: "Открытых жалоб", value: openComplaints.length, alert: openComplaints.length > 0, href: "/complaints" },
          { label: "Просроч. долгов", value: overdueDebts.length, alert: overdueDebts.length > 0, href: "/debts" },
        ].map((s) => (
          <Link key={s.label} href={s.href} className="block bg-white rounded-xl border border-[#E5DED2] p-4 hover:shadow-md transition-shadow">
            <p className="text-[10px] font-semibold text-[#8A7E72] uppercase tracking-wide">{s.label}</p>
            <p className={`text-xl font-bold mt-1 ${s.value === 0 ? "text-[#C8C0B4]" : s.alert ? "text-red-600" : "text-[#1E1E1E]"}`}>{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Дисциплина — смены</CardTitle>
            <Link href="/shifts" className="text-xs text-[#C8A45D] hover:underline flex items-center gap-1">Все <ArrowRight size={11} /></Link>
          </CardHeader>
          {shifts.length === 0 ? (
            <EmptyState icon={Clock} title="Нет данных о сменах" description="Аскар должен отметить приход сотрудников" className="py-8" />
          ) : (
            <div className="space-y-1.5">
              {shifts.slice(0, 5).map((s) => (
                <div key={s.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-[#1E1E1E]">{s.employee}</p>
                    <p className="text-xs text-[#8A7E72]">{s.role}</p>
                  </div>
                  {s.late ? <Badge variant="warning">+{s.late} мин</Badge> : <Badge variant="success">Вовремя</Badge>}
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Задачи Аскара</CardTitle>
            <Link href="/tasks" className="text-xs text-[#C8A45D] hover:underline flex items-center gap-1">Все <ArrowRight size={11} /></Link>
          </CardHeader>
          {tasks.length === 0 ? (
            <EmptyState icon={CheckSquare} title="Задач нет" description="" className="py-8" />
          ) : (
            <div className="space-y-1.5">
              {tasks.filter(t => t.assignee === "Аскар").slice(0, 5).map((t) => (
                <div key={t.id} className="flex items-center gap-2 py-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${t.priority === "high" ? "bg-red-500" : "bg-yellow-500"}`} />
                  <p className="text-sm text-[#1E1E1E] flex-1 truncate">{t.title}</p>
                  <Badge variant={t.status === "overdue" ? "danger" : "neutral"}>{t.dueDate}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Жалобы</CardTitle>
            <Link href="/complaints" className="text-xs text-[#C8A45D] hover:underline flex items-center gap-1">Все <ArrowRight size={11} /></Link>
          </CardHeader>
          {complaints.length === 0 ? (
            <EmptyState icon={AlertCircle} title="Жалоб нет" description="" className="py-6" />
          ) : (
            <div className="space-y-1.5">
              {complaints.slice(0, 4).map((c) => (
                <div key={c.id} className="flex items-center justify-between text-sm">
                  <p className="text-[#1E1E1E] truncate">{c.product}</p>
                  <Badge variant={c.status === "overdue" ? "danger" : "warning"}>{c.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Списания</CardTitle>
            <Link href="/writeoffs" className="text-xs text-[#C8A45D] hover:underline flex items-center gap-1">Все <ArrowRight size={11} /></Link>
          </CardHeader>
          {writeOffs.length === 0 ? (
            <EmptyState icon={Trash2} title="Списаний нет" description="" className="py-6" />
          ) : (
            <div className="space-y-1.5">
              {writeOffs.slice(0, 4).map((w) => (
                <div key={w.id} className="flex items-center justify-between text-sm">
                  <p className="text-[#1E1E1E]">{w.product}</p>
                  <span className="text-red-600 font-semibold">{formatMoney(w.amount)}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
