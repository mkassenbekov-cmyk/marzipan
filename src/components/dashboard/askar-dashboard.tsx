"use client";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart, Archive, Clock, Camera, CheckSquare, ArrowRight,
  AlertTriangle, PackageCheck, ClipboardCheck, Moon, Sun, Thermometer,
  Scale, FileText, MessageSquare, TrendingDown, ChevronRight, Plus
} from "lucide-react";
import Link from "next/link";

function SectionBlock({ title, icon: Icon, href, count, countAlert, children }: {
  title: string; icon: React.ElementType; href: string;
  count?: number; countAlert?: boolean; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-[#E5DED2] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#F7F3EC]">
        <div className="flex items-center gap-2">
          <Icon size={15} className="text-[#C8A45D]" />
          <p className="text-sm font-semibold text-[#1E1E1E]">{title}</p>
          {count !== undefined && count > 0 && (
            <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${countAlert ? "bg-red-100 text-red-600" : "bg-[#F7F3EC] text-[#8A7E72]"}`}>
              {count}
            </span>
          )}
        </div>
        <Link href={href} className="flex items-center gap-1 text-xs text-[#C8A45D] hover:underline">
          Открыть <ChevronRight size={12} />
        </Link>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function EmptyRow({ text }: { text: string }) {
  return <p className="text-sm text-[#C8C0B4] italic">{text}</p>;
}

function CheckRow({ label, ok, href }: { label: string; ok: boolean | null; href?: string }) {
  const content = (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-[#1E1E1E]">{label}</span>
      {ok === null
        ? <span className="text-xs text-[#C8C0B4]">ожидает</span>
        : ok
          ? <span className="text-xs font-medium text-green-600">✓ OK</span>
          : <span className="text-xs font-bold text-red-600">⚠ требует внимания</span>
      }
    </div>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}

export function AskarDashboard() {
  const { purchaseRequests, shifts, tasks, photos, writeOffs, complaints, invoices, kaspiPayments, customers, addTask } = useStore();

  const [taskTitle, setTaskTitle] = useState("");
  const [sending, setSending] = useState(false);
  const addSelfTask = async () => {
    if (!taskTitle.trim()) return;
    setSending(true);
    await addTask({
      title: taskTitle.trim(), assignedTo: "Аскар", assignedBy: "Аскар",
      dueDate: new Date().toISOString().split("T")[0], priority: "medium", status: "open",
    });
    setTaskTitle(""); setSending(false);
  };

  const today = new Date().toISOString().split("T")[0];
  const todayShifts = shifts.filter(s => s.date === today);
  const criticalPurchase = purchaseRequests.filter(r => r.urgency === "critical" && r.status === "new");
  const openPurchase = purchaseRequests.filter(r => r.status === "new" || r.status === "approved");
  const overdueTasks = tasks.filter(t => t.status === "overdue");
  const openTasks = tasks.filter(t => t.status !== "done");
  const pendingInvoices = invoices.filter(i => i.status === "pending" || i.status === "received");
  const unmatchedPayments = kaspiPayments.filter(p => p.status === "unmatched");
  const openComplaints = complaints.filter(c => c.status !== "closed");
  const todayWriteoffs = writeOffs.filter(w => w.date === today);

  // Checklist items — null = no data yet, true = ok, false = needs attention
  const checklistItems = [
    { label: "Ночной отчёт проверен", ok: null as boolean | null, href: "/shifts" },
    { label: "Остатки после ночи приняты", ok: null as boolean | null, href: "/inventory" },
    { label: "Заготовки проверены", ok: null as boolean | null, href: "/inventory" },
    { label: "Холодильники проверены", ok: null as boolean | null, href: "/inspection" },
    { label: "Маркировки проверены", ok: null as boolean | null, href: "/inspection" },
    { label: "Граммовки (утро)", ok: null as boolean | null, href: "/inspection" },
    { label: "Граммовки (день)", ok: null as boolean | null, href: "/inspection" },
    { label: "Граммовки (вечер)", ok: null as boolean | null, href: "/inspection" },
    { label: "Журнал уборки заполнен", ok: null as boolean | null, href: "/inspection" },
    { label: "Фотоотчёты зон сданы", ok: photos.length > 0 ? photos.some(p => p.status === "approved") : null, href: "/photos" },
    { label: "Итог смены сформирован", ok: null as boolean | null, href: "/shifts" },
  ];

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Доброе утро" : hour < 18 ? "Добрый день" : "Добрый вечер";
  const dateStr = now.toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" });

  const alertCount = criticalPurchase.length + overdueTasks.length + openComplaints.length + pendingInvoices.length;

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="bg-gradient-to-r from-[#2A2521] to-[#3d3530] rounded-xl p-5 text-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[#C8A45D] text-xs font-semibold uppercase tracking-wide mb-1">{greeting}, Аскар</p>
            <p className="text-white font-semibold capitalize">{dateStr}</p>
            <p className="text-white/50 text-xs mt-1">
              {hour < 12 ? "Приём смены · Проверка ночного отчёта" : hour < 17 ? "Дневная смена · Контроль производства" : "Завершение смены · Подготовка к ночи"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {hour < 14 ? <Moon size={18} className="text-[#C8A45D]/70" /> : <Sun size={18} className="text-[#C8A45D]/70" />}
            {alertCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">{alertCount} !</span>
            )}
          </div>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Критич. заявки", value: criticalPurchase.length, href: "/purchase", alert: criticalPurchase.length > 0 },
          { label: "Просрочено задач", value: overdueTasks.length, href: "/tasks", alert: overdueTasks.length > 0 },
          { label: "Накладные к приёмке", value: pendingInvoices.length, href: "/invoices", alert: pendingInvoices.length > 0 },
          { label: "Жалоб открыто", value: openComplaints.length, href: "/complaints", alert: openComplaints.length > 0 },
        ].map((s) => (
          <Link key={s.label} href={s.href} className="block bg-white rounded-xl border border-[#E5DED2] p-4 hover:shadow-md transition-shadow">
            <p className="text-[10px] font-semibold text-[#8A7E72] uppercase tracking-wide leading-tight">{s.label}</p>
            <p className={`text-2xl font-bold mt-1.5 ${s.value === 0 ? "text-[#C8C0B4]" : s.alert ? "text-red-600" : "text-[#1E1E1E]"}`}>{s.value}</p>
          </Link>
        ))}
      </div>

      {/* Quick task */}
      <div className="bg-white rounded-xl border border-[#E5DED2] p-4">
        <div className="flex items-center gap-2 mb-2">
          <Plus size={15} className="text-[#C8A45D]" />
          <p className="text-sm font-semibold text-[#1E1E1E]">Поставить задачу</p>
        </div>
        <div className="flex gap-2">
          <input
            value={taskTitle}
            onChange={e => setTaskTitle(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addSelfTask()}
            placeholder="Задача по цеху или себе на сегодня..."
            className="flex-1 border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30"
          />
          <button onClick={addSelfTask} disabled={sending || !taskTitle.trim()}
            className="px-3 py-2 bg-[#2A2521] text-white rounded-lg text-sm font-medium hover:bg-[#3d3530] disabled:opacity-40 flex items-center gap-1">
            <Plus size={15} /> Добавить
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Daily checklist */}
        <SectionBlock title="Чек-лист дня" icon={ClipboardCheck} href="/inspection" count={checklistItems.filter(i => i.ok === false).length} countAlert>
          <div className="divide-y divide-[#F7F3EC]">
            {checklistItems.map((item) => (
              <CheckRow key={item.label} label={item.label} ok={item.ok} href={item.href} />
            ))}
          </div>
          <Link href="/inspection" className="mt-3 block w-full text-center py-2 bg-[#F7F3EC] rounded-lg text-xs font-medium text-[#2A2521] hover:bg-[#EDE8E0]">
            Открыть журнал обхода
          </Link>
        </SectionBlock>

        {/* Right column */}
        <div className="space-y-4">

          {/* Purchase requests */}
          <SectionBlock title="Заявки на закуп" icon={ShoppingCart} href="/purchase" count={openPurchase.length} countAlert={criticalPurchase.length > 0}>
            {openPurchase.length === 0 ? <EmptyRow text="Открытых заявок нет" /> : (
              <div className="space-y-2">
                {openPurchase.slice(0, 4).map((r) => (
                  <div key={r.id} className="flex items-center justify-between">
                    <span className="text-sm text-[#1E1E1E] truncate flex-1">{r.product}</span>
                    <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
                      <span className="text-xs text-[#8A7E72]">{r.quantity} {r.unit}</span>
                      <Badge variant={r.urgency === "critical" ? "danger" : r.urgency === "high" ? "warning" : "neutral"}>
                        {r.urgency === "critical" ? "!" : r.urgency === "high" ? "срочно" : "норм"}
                      </Badge>
                    </div>
                  </div>
                ))}
                {openPurchase.length > 4 && <p className="text-xs text-[#8A7E72]">ещё {openPurchase.length - 4}...</p>}
              </div>
            )}
          </SectionBlock>

          {/* Invoices to accept */}
          <SectionBlock title="Накладные к приёмке" icon={PackageCheck} href="/invoices" count={pendingInvoices.length} countAlert={pendingInvoices.length > 0}>
            {pendingInvoices.length === 0 ? <EmptyRow text="Накладных к приёмке нет" /> : (
              <div className="space-y-2">
                {pendingInvoices.slice(0, 3).map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between">
                    <span className="text-sm text-[#1E1E1E] truncate flex-1">{inv.supplier || inv.supplierName}</span>
                    <span className="text-xs text-[#8A7E72] ml-2">{inv.amount?.toLocaleString("ru-RU")} ₸</span>
                  </div>
                ))}
              </div>
            )}
          </SectionBlock>

          {/* Tasks */}
          <SectionBlock title="Задачи" icon={CheckSquare} href="/tasks" count={openTasks.length} countAlert={overdueTasks.length > 0}>
            {openTasks.length === 0 ? <EmptyRow text="Открытых задач нет" /> : (
              <div className="space-y-1">
                {openTasks.slice(0, 4).map((t) => (
                  <div key={t.id} className="flex items-center gap-2 py-1">
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${t.status === "overdue" ? "bg-red-500" : t.priority === "high" ? "bg-yellow-500" : "bg-[#C8C0B4]"}`} />
                    <p className="text-sm text-[#1E1E1E] flex-1 truncate">{t.title}</p>
                    {t.dueDate && <span className="text-xs text-[#8A7E72] flex-shrink-0">{t.dueDate}</span>}
                  </div>
                ))}
              </div>
            )}
          </SectionBlock>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Writeoffs today */}
        <SectionBlock title="Списания сегодня" icon={Scale} href="/writeoffs" count={todayWriteoffs.length}>
          {todayWriteoffs.length === 0 ? <EmptyRow text="Списаний сегодня нет" /> : (
            <div className="space-y-1.5">
              {todayWriteoffs.slice(0, 3).map((w) => (
                <div key={w.id} className="flex items-center justify-between">
                  <span className="text-sm text-[#1E1E1E] truncate flex-1">{w.product}</span>
                  <span className="text-xs text-red-500 ml-2">{w.amount > 0 ? `${w.amount.toLocaleString("ru-RU")} ₸` : `${w.quantity} ${w.unit}`}</span>
                </div>
              ))}
            </div>
          )}
        </SectionBlock>

        {/* Complaints */}
        <SectionBlock title="Жалобы" icon={MessageSquare} href="/complaints" count={openComplaints.length} countAlert={openComplaints.length > 0}>
          {openComplaints.length === 0 ? <EmptyRow text="Открытых жалоб нет" /> : (
            <div className="space-y-1.5">
              {openComplaints.slice(0, 3).map((c) => (
                <div key={c.id} className="flex items-center justify-between">
                  <span className="text-sm text-[#1E1E1E] truncate flex-1">{c.client}</span>
                  <Badge variant={c.severity === "critical" || c.severity === "high" ? "danger" : "warning"}>
                    {c.product || "—"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </SectionBlock>

        {/* Unmatched payments */}
        <SectionBlock title="Оплаты без клиента" icon={AlertTriangle} href="/kaspi-pay" count={unmatchedPayments.length} countAlert={unmatchedPayments.length > 0}>
          {unmatchedPayments.length === 0 ? <EmptyRow text="Все платежи сопоставлены" /> : (
            <div className="space-y-1.5">
              {unmatchedPayments.slice(0, 3).map((p) => (
                <div key={p.id} className="flex items-center justify-between">
                  <span className="text-sm text-[#1E1E1E] truncate flex-1">{p.sender || p.senderName || "Неизвестно"}</span>
                  <span className="text-xs font-semibold text-[#C8A45D]">{p.amount?.toLocaleString("ru-RU")} ₸</span>
                </div>
              ))}
            </div>
          )}
        </SectionBlock>
      </div>

    </div>
  );
}
