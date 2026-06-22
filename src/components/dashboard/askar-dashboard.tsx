"use client";
import { useStore } from "@/lib/store";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart, Archive, Clock, Camera, CheckSquare, ClipboardList, ArrowRight, Lightbulb
} from "lucide-react";
import Link from "next/link";

export function AskarDashboard() {
  const { purchaseRequests, shifts, tasks, photos } = useStore();

  const criticalPurchase = purchaseRequests.filter(r => r.urgency === "critical" && r.status === "new");
  const lateShifts = shifts.filter(s => s.late && s.late > 0);
  const openTasks = tasks.filter(t => t.status !== "done");
  const pendingPhotos = photos.filter(p => p.status === "pending");

  const isEmpty = purchaseRequests.length === 0 && shifts.length === 0 && tasks.length === 0;

  return (
    <div className="space-y-5">
      {isEmpty && (
        <div className="bg-gradient-to-r from-[#2A2521] to-[#3d3530] rounded-xl p-5 text-white">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#C8A45D]/20 flex items-center justify-center flex-shrink-0">
              <Lightbulb size={20} className="text-[#C8A45D]" />
            </div>
            <div>
              <p className="font-semibold text-white">Привет! Начнём работу</p>
              <p className="text-white/60 text-sm mt-1 leading-5">
                Отметьте приход смены, подайте первые заявки на закуп и сдайте фотоотчёты по зонам.
              </p>
              <div className="flex gap-2 mt-3 flex-wrap">
                <Link href="/shifts" className="px-3 py-1.5 bg-[#C8A45D] text-white rounded-lg text-xs font-medium hover:bg-[#B8944D]">Отметить смену</Link>
                <Link href="/purchase" className="px-3 py-1.5 bg-white/10 text-white rounded-lg text-xs font-medium hover:bg-white/20">Заявка на закуп</Link>
                <Link href="/photos" className="px-3 py-1.5 bg-white/10 text-white rounded-lg text-xs font-medium hover:bg-white/20">Фотоотчёт</Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Критичных заявок", value: criticalPurchase.length, href: "/purchase", icon: ShoppingCart, alert: criticalPurchase.length > 0 },
          { label: "Опозданий", value: lateShifts.length, href: "/shifts", icon: Clock, alert: lateShifts.length > 0 },
          { label: "Незакрытых задач", value: openTasks.length, href: "/tasks", icon: CheckSquare, alert: openTasks.some(t => t.status === "overdue") },
          { label: "Ожид. фотоотчётов", value: pendingPhotos.length, href: "/photos", icon: Camera, alert: false },
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
            <CardTitle>Заявки на закуп</CardTitle>
            <Link href="/purchase" className="text-xs text-[#C8A45D] hover:underline flex items-center gap-1">Все <ArrowRight size={11} /></Link>
          </CardHeader>
          {purchaseRequests.length === 0 ? (
            <EmptyState icon={ShoppingCart} title="Заявок нет" description="Подайте первую заявку на закуп" className="py-8" />
          ) : (
            <div className="space-y-1.5">
              {purchaseRequests.slice(0, 5).map((r) => (
                <div key={r.id} className="flex items-center justify-between text-sm">
                  <span className="text-[#1E1E1E]">{r.product}</span>
                  <Badge variant={r.urgency === "critical" ? "danger" : r.urgency === "high" ? "warning" : "neutral"}>
                    {r.quantity} {r.unit}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Смены сегодня</CardTitle>
            <Link href="/shifts" className="text-xs text-[#C8A45D] hover:underline flex items-center gap-1">Все <ArrowRight size={11} /></Link>
          </CardHeader>
          {shifts.length === 0 ? (
            <EmptyState icon={Clock} title="Нет записей о смене" description="Отметьте приход сотрудников" className="py-8" />
          ) : (
            <div className="space-y-1.5">
              {shifts.slice(0, 5).map((s) => (
                <div key={s.id} className="flex items-center justify-between text-sm">
                  <span className="text-[#1E1E1E] truncate max-w-[150px]">{s.employee}</span>
                  {s.late ? <Badge variant="warning">+{s.late} мин</Badge> : <Badge variant="success">Вовремя</Badge>}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Задачи</CardTitle>
            <Link href="/tasks" className="text-xs text-[#C8A45D] hover:underline flex items-center gap-1">Все <ArrowRight size={11} /></Link>
          </CardHeader>
          {tasks.length === 0 ? (
            <EmptyState icon={CheckSquare} title="Задач нет" description="" className="py-6" />
          ) : (
            <div className="space-y-1">
              {openTasks.slice(0, 4).map((t) => (
                <div key={t.id} className="flex items-center gap-2 py-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${t.status === "overdue" ? "bg-red-500" : "bg-yellow-500"}`} />
                  <p className="text-sm text-[#1E1E1E] flex-1 truncate">{t.title}</p>
                  <span className="text-xs text-[#8A7E72]">{t.dueDate}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Фотоотчёты</CardTitle>
            <Link href="/photos" className="text-xs text-[#C8A45D] hover:underline flex items-center gap-1">Открыть <ArrowRight size={11} /></Link>
          </CardHeader>
          {photos.length === 0 ? (
            <EmptyState icon={Camera} title="Фотоотчётов нет" description="Сдайте фото по зонам" className="py-6" />
          ) : (
            <div className="space-y-1.5">
              {photos.slice(0, 4).map((p) => (
                <div key={p.id} className="flex items-center justify-between text-sm">
                  <span className="text-[#1E1E1E]">{p.type}</span>
                  <Badge variant={p.status === "approved" ? "success" : "warning"}>{p.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
