"use client";
import { useState, useMemo } from "react";
import { useStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { formatMoney } from "@/lib/utils";
import {
  TrendingUp, Receipt, CheckSquare, Wallet, ClipboardCheck, AlertTriangle,
  MessageSquare, TrendingDown, ChevronRight, Plus, Send, Percent, Target
} from "lucide-react";
import Link from "next/link";

function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function OwnerDashboard() {
  const { salesData, complaints, tasks, debts, employees, shifts, addTask } = useStore();

  const thisMonth = monthKey(new Date());

  // ---- Real data: salary fund this month ----
  const salaryFund = useMemo(() => {
    return employees.filter(e => e.active).reduce((sum, e) => {
      const empShifts = shifts.filter(s => s.employee === e.name && (s.date ?? "").slice(0, 7) === thisMonth);
      const lates = empShifts.filter(s => s.late && s.late > 0).length;
      return sum + empShifts.length * e.shiftRate - lates * e.latePenalty;
    }, 0);
  }, [employees, shifts, thisMonth]);

  // ---- Real management data ----
  const overdueDebts = debts.filter(d => d.status === "overdue").reduce((s, d) => s + (d.overdueAmount ?? d.amount ?? 0), 0);
  const openComplaints = complaints.filter(c => c.status !== "closed");
  const overdueTasks = tasks.filter(t => t.status === "overdue");
  const askarTasks = tasks.filter(t => (t.assignedTo === "Аскар" || t.assignee === "Аскар") && t.status !== "done");
  const monthRevenue = salesData.filter(d => (d.date ?? "").slice(0, 7) === thisMonth).reduce((s, d) => s + d.revenue, 0);

  // ---- Quick task to Askar ----
  const [taskTitle, setTaskTitle] = useState("");
  const [sending, setSending] = useState(false);
  const sendTask = async () => {
    if (!taskTitle.trim()) return;
    setSending(true);
    await addTask({
      title: taskTitle.trim(), assignedTo: "Аскар", assignedBy: "Мади",
      dueDate: new Date().toISOString().split("T")[0], priority: "medium", status: "open",
    });
    setTaskTitle(""); setSending(false);
  };

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Доброе утро" : hour < 18 ? "Добрый день" : "Добрый вечер";
  const dateStr = now.toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="bg-gradient-to-r from-[#2A2521] to-[#3d3530] rounded-xl p-5 text-white">
        <p className="text-[#C8A45D] text-xs font-semibold uppercase tracking-wide mb-1">{greeting}, Мади</p>
        <p className="text-white font-semibold capitalize">{dateStr}</p>
        <p className="text-white/50 text-xs mt-1">Управленческая картина цеха</p>
      </div>

      {/* KPI row — owner metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Выручка за месяц" value={monthRevenue > 0 ? formatMoney(monthRevenue) : "—"}
          icon={TrendingUp} href="/sales" empty={monthRevenue === 0} hint={monthRevenue === 0 ? "Из iiko" : undefined} />
        <KpiCard label="Себестоимость" value="—" icon={Percent} href="/prices" empty hint="Из iiko" />
        <KpiCard label="Фонд зарплаты (мес)" value={salaryFund > 0 ? formatMoney(salaryFund) : "—"}
          icon={Wallet} href="/salary" empty={salaryFund === 0} hint={salaryFund === 0 ? "Нет смен" : "Расчётно"} />
        <KpiCard label="Просрочка по долгам" value={overdueDebts > 0 ? formatMoney(overdueDebts) : "—"}
          icon={Receipt} href="/debts" empty={overdueDebts === 0} alert={overdueDebts > 0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Контроль Аскара */}
        <div className="bg-white rounded-xl border border-[#E5DED2] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#F7F3EC]">
            <div className="flex items-center gap-2">
              <ClipboardCheck size={15} className="text-[#C8A45D]" />
              <p className="text-sm font-semibold text-[#1E1E1E]">Контроль Аскара</p>
            </div>
            <Link href="/inspection" className="flex items-center gap-1 text-xs text-[#C8A45D] hover:underline">
              Журнал обхода <ChevronRight size={12} />
            </Link>
          </div>
          <div className="p-4 grid grid-cols-2 gap-3">
            <ControlTile label="Открытых жалоб" value={openComplaints.length} href="/complaints" icon={MessageSquare} alert={openComplaints.length > 0} />
            <ControlTile label="Просрочено задач" value={overdueTasks.length} href="/tasks" icon={AlertTriangle} alert={overdueTasks.length > 0} />
            <ControlTile label="Задач у Аскара" value={askarTasks.length} href="/tasks" icon={CheckSquare} />
            <ControlTile label="Сотрудников" value={employees.filter(e => e.active).length} href="/employees" icon={Wallet} />
          </div>
        </div>

        {/* Задачи Аскару */}
        <div className="bg-white rounded-xl border border-[#E5DED2] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#F7F3EC]">
            <div className="flex items-center gap-2">
              <Send size={15} className="text-[#C8A45D]" />
              <p className="text-sm font-semibold text-[#1E1E1E]">Поставить задачу Аскару</p>
            </div>
            <Link href="/tasks" className="flex items-center gap-1 text-xs text-[#C8A45D] hover:underline">
              Все задачи <ChevronRight size={12} />
            </Link>
          </div>
          <div className="p-4">
            <div className="flex gap-2">
              <input
                value={taskTitle}
                onChange={e => setTaskTitle(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendTask()}
                placeholder="Что нужно сделать..."
                className="flex-1 border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30"
              />
              <button onClick={sendTask} disabled={sending || !taskTitle.trim()}
                className="px-3 py-2 bg-[#2A2521] text-white rounded-lg text-sm font-medium hover:bg-[#3d3530] disabled:opacity-40 flex items-center gap-1">
                <Plus size={15} /> Поставить
              </button>
            </div>
            <div className="mt-3 space-y-1">
              {askarTasks.length === 0 ? (
                <p className="text-sm text-[#C8C0B4] italic">Активных задач у Аскара нет</p>
              ) : askarTasks.slice(0, 5).map(t => (
                <div key={t.id} className="flex items-center gap-2 py-1">
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${t.status === "overdue" ? "bg-red-500" : "bg-[#C8A45D]"}`} />
                  <p className="text-sm text-[#1E1E1E] flex-1 truncate">{t.title}</p>
                  {t.dueDate && <span className="text-xs text-[#8A7E72]">{t.dueDate}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: sales + customer decline (iiko placeholders) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PlaceholderCard
          title="Продажи и выполнение плана"
          href="/sales"
          icon={Target}
          text="Подключите iiko — здесь появится выручка по дням, план/факт и динамика."
        />
        <PlaceholderCard
          title="Спад объёмов по заказчикам"
          href="/sales-decline"
          icon={TrendingDown}
          text="Подключите iiko — система покажет заказчиков, снизивших объёмы."
        />
      </div>
    </div>
  );
}

function KpiCard({ label, value, icon: Icon, href, empty, hint, alert }: {
  label: string; value: string; icon: React.ElementType; href: string;
  empty?: boolean; hint?: string; alert?: boolean;
}) {
  return (
    <Link href={href} className="block bg-white rounded-xl border border-[#E5DED2] p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold text-[#8A7E72] uppercase tracking-wide leading-tight">{label}</p>
          <p className={`text-xl font-bold mt-1.5 ${empty ? "text-[#C8C0B4]" : alert ? "text-red-600" : "text-[#1E1E1E]"}`}>{value}</p>
          {hint && <p className="text-[10px] text-[#C8C0B4] mt-0.5">{hint}</p>}
        </div>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${empty ? "bg-[#F7F3EC]" : "bg-[#C8A45D]/10"}`}>
          <Icon size={16} className={empty ? "text-[#C8C0B4]" : "text-[#C8A45D]"} />
        </div>
      </div>
    </Link>
  );
}

function ControlTile({ label, value, href, icon: Icon, alert }: {
  label: string; value: number; href: string; icon: React.ElementType; alert?: boolean;
}) {
  return (
    <Link href={href} className="flex items-center gap-3 p-3 rounded-lg bg-[#F7F3EC] hover:bg-[#EDE8E0] transition-colors">
      <Icon size={16} className={alert ? "text-red-500" : "text-[#8A7E72]"} />
      <div>
        <p className={`text-lg font-bold leading-none ${value === 0 ? "text-[#C8C0B4]" : alert ? "text-red-600" : "text-[#1E1E1E]"}`}>{value}</p>
        <p className="text-[10px] text-[#8A7E72] mt-1">{label}</p>
      </div>
    </Link>
  );
}

function PlaceholderCard({ title, href, icon: Icon, text }: {
  title: string; href: string; icon: React.ElementType; text: string;
}) {
  return (
    <Link href={href} className="block bg-white rounded-xl border border-[#E5DED2] p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={15} className="text-[#C8A45D]" />
        <p className="text-sm font-semibold text-[#1E1E1E]">{title}</p>
      </div>
      <p className="text-xs text-[#8A7E72] leading-5">{text}</p>
    </Link>
  );
}
