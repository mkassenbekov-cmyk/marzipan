"use client";
import { useState, useMemo } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import { formatMoney } from "@/lib/utils";
import {
  Wallet, Activity, ClipboardList, ChevronLeft, ChevronRight,
  Clock, AlertTriangle, TrendingUp, TrendingDown, Package, Users
} from "lucide-react";

type Tab = "salary" | "efficiency" | "audit";

function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function monthLabel(key: string) {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1).toLocaleDateString("ru-RU", { month: "long", year: "numeric" });
}
function addMonths(key: string, delta: number) {
  const [y, m] = key.split("-").map(Number);
  return monthKey(new Date(y, m - 1 + delta));
}

export default function ReportsPage() {
  const { employees, shifts, writeOffs } = useStore();
  const [tab, setTab] = useState<Tab>("salary");
  const [month, setMonth] = useState(monthKey(new Date()));

  const inMonth = (date?: string) => (date ?? "").slice(0, 7) === month;

  // ---- per-employee metrics for the month ----
  const empStats = useMemo(() => {
    return employees.filter(e => e.active).map(e => {
      const empShifts = shifts.filter(s => s.employee === e.name && inMonth(s.date));
      const shiftsCount = empShifts.length;
      const lates = empShifts.filter(s => s.late && s.late > 0).length;
      const onTime = shiftsCount - lates;
      const punctuality = shiftsCount > 0 ? Math.round((onTime / shiftsCount) * 100) : 0;
      const gross = shiftsCount * e.shiftRate;
      const penalties = lates * e.latePenalty;
      const net = gross - penalties;
      return { e, shiftsCount, lates, onTime, punctuality, gross, penalties, net };
    });
  }, [employees, shifts, month]);

  const prevStats = useMemo(() => {
    const pm = addMonths(month, -1);
    return employees.filter(e => e.active).reduce((sum, e) => {
      const empShifts = shifts.filter(s => s.employee === e.name && (s.date ?? "").slice(0, 7) === pm);
      const lates = empShifts.filter(s => s.late && s.late > 0).length;
      return sum + empShifts.length * e.shiftRate - lates * e.latePenalty;
    }, 0);
  }, [employees, shifts, month]);

  const totalFund = empStats.reduce((s, r) => s + r.net, 0);
  const totalShifts = empStats.reduce((s, r) => s + r.shiftsCount, 0);
  const fundDelta = prevStats > 0 ? Math.round(((totalFund - prevStats) / prevStats) * 100) : 0;

  // ---- writeoff (audit) analytics for the month ----
  const monthWriteoffs = writeOffs.filter(w => inMonth(w.date));
  const writeoffTotal = monthWriteoffs.reduce((s, w) => s + (w.amount || 0), 0);
  const byReason = useMemo(() => {
    const map: Record<string, { count: number; amount: number }> = {};
    monthWriteoffs.forEach(w => {
      const key = w.reason || "Без причины";
      if (!map[key]) map[key] = { count: 0, amount: 0 };
      map[key].count++; map[key].amount += w.amount || 0;
    });
    return Object.entries(map).sort((a, b) => b[1].amount - a[1].amount);
  }, [monthWriteoffs]);
  const byProduct = useMemo(() => {
    const map: Record<string, { count: number; amount: number }> = {};
    monthWriteoffs.forEach(w => {
      const key = w.product || "—";
      if (!map[key]) map[key] = { count: 0, amount: 0 };
      map[key].count++; map[key].amount += w.amount || 0;
    });
    return Object.entries(map).sort((a, b) => b[1].amount - a[1].amount).slice(0, 8);
  }, [monthWriteoffs]);

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "salary", label: "Зарплата", icon: Wallet },
    { id: "efficiency", label: "Эффективность", icon: Activity },
    { id: "audit", label: "Ревизия и потери", icon: ClipboardList },
  ];

  const noEmployees = employees.filter(e => e.active).length === 0;

  return (
    <PageShell title="Отчёты и аналитика">
      <div className="space-y-4">

        {/* Tabs + month */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex gap-2">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  tab === t.id ? "bg-[#2A2521] text-white" : "bg-white border border-[#E5DED2] text-[#8A7E72] hover:text-[#1E1E1E]"
                }`}>
                <t.icon size={15} /> {t.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 bg-white border border-[#E5DED2] rounded-lg px-2 py-1.5">
            <button onClick={() => setMonth(addMonths(month, -1))} className="p-1 rounded hover:bg-[#F7F3EC]"><ChevronLeft size={16} className="text-[#8A7E72]" /></button>
            <span className="text-sm font-semibold text-[#1E1E1E] capitalize min-w-[140px] text-center">{monthLabel(month)}</span>
            <button onClick={() => setMonth(addMonths(month, 1))} className="p-1 rounded hover:bg-[#F7F3EC]"><ChevronRight size={16} className="text-[#8A7E72]" /></button>
          </div>
        </div>

        {/* ============ SALARY ============ */}
        {tab === "salary" && (
          noEmployees ? (
            <div className="bg-white rounded-xl border border-[#E5DED2]"><EmptyState icon={Wallet} title="Нет активных сотрудников" description="Добавьте сотрудников со ставкой за смену в разделе «Сотрудники»." /></div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <StatCard label="Фонд ЗП за месяц" value={formatMoney(totalFund)} />
                <StatCard label="Отработано смен" value={String(totalShifts)} />
                <StatCard label="Сотрудников" value={String(empStats.length)} />
                <StatCard label="Динамика к прошлому" value={prevStats > 0 ? `${fundDelta > 0 ? "+" : ""}${fundDelta}%` : "—"}
                  tone={fundDelta > 0 ? "up" : fundDelta < 0 ? "down" : undefined} />
              </div>
              <div className="bg-white rounded-xl border border-[#E5DED2] overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-[#F7F3EC]">
                    <tr className="text-xs text-[#8A7E72] uppercase tracking-wide">
                      <th className="text-left px-4 py-3 font-medium">Сотрудник</th>
                      <th className="text-center px-3 py-3 font-medium">Смены</th>
                      <th className="text-center px-3 py-3 font-medium">Опозд.</th>
                      <th className="text-right px-3 py-3 font-medium">Начислено</th>
                      <th className="text-right px-3 py-3 font-medium">Штрафы</th>
                      <th className="text-right px-4 py-3 font-medium">К выплате</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F7F3EC]">
                    {empStats.map(r => (
                      <tr key={r.e.id} className="hover:bg-[#F7F3EC]">
                        <td className="px-4 py-3">
                          <p className="font-medium text-[#1E1E1E]">{r.e.name}</p>
                          <p className="text-xs text-[#8A7E72]">{r.e.position || "—"}</p>
                        </td>
                        <td className="px-3 py-3 text-center font-semibold">{r.shiftsCount}</td>
                        <td className="px-3 py-3 text-center">{r.lates > 0 ? <span className="text-yellow-600">{r.lates}</span> : <span className="text-[#C8C0B4]">0</span>}</td>
                        <td className="px-3 py-3 text-right">{formatMoney(r.gross)}</td>
                        <td className="px-3 py-3 text-right text-red-500">{r.penalties > 0 ? `−${formatMoney(r.penalties)}` : "—"}</td>
                        <td className="px-4 py-3 text-right font-bold">{formatMoney(r.net)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-[#F7F3EC] font-semibold">
                      <td className="px-4 py-3" colSpan={5}>Итого фонд ЗП</td>
                      <td className="px-4 py-3 text-right text-base">{formatMoney(totalFund)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )
        )}

        {/* ============ EFFICIENCY ============ */}
        {tab === "efficiency" && (
          noEmployees ? (
            <div className="bg-white rounded-xl border border-[#E5DED2]"><EmptyState icon={Activity} title="Нет данных" description="Добавьте сотрудников и отметьте смены для анализа дисциплины и эффективности." /></div>
          ) : (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-[#E5DED2] overflow-hidden">
                <div className="px-4 py-3 border-b border-[#F7F3EC] flex items-center gap-2">
                  <Clock size={15} className="text-[#C8A45D]" />
                  <p className="text-sm font-semibold text-[#1E1E1E]">Дисциплина и пунктуальность</p>
                </div>
                <table className="w-full text-sm">
                  <thead className="bg-[#F7F3EC]">
                    <tr className="text-xs text-[#8A7E72] uppercase tracking-wide">
                      <th className="text-left px-4 py-3 font-medium">Сотрудник</th>
                      <th className="text-center px-3 py-3 font-medium">Смены</th>
                      <th className="text-center px-3 py-3 font-medium">Вовремя</th>
                      <th className="text-center px-3 py-3 font-medium">Опозданий</th>
                      <th className="text-left px-4 py-3 font-medium w-40">Пунктуальность</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F7F3EC]">
                    {empStats.map(r => (
                      <tr key={r.e.id} className="hover:bg-[#F7F3EC]">
                        <td className="px-4 py-3 font-medium text-[#1E1E1E]">{r.e.name}</td>
                        <td className="px-3 py-3 text-center">{r.shiftsCount}</td>
                        <td className="px-3 py-3 text-center text-green-600">{r.onTime}</td>
                        <td className="px-3 py-3 text-center text-yellow-600">{r.lates}</td>
                        <td className="px-4 py-3">
                          {r.shiftsCount === 0 ? <span className="text-[#C8C0B4] text-xs">нет смен</span> : (
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-[#F7F3EC] rounded-full h-1.5">
                                <div className={`h-1.5 rounded-full ${r.punctuality >= 90 ? "bg-green-500" : r.punctuality >= 70 ? "bg-yellow-500" : "bg-red-500"}`} style={{ width: `${r.punctuality}%` }} />
                              </div>
                              <span className="text-xs font-semibold w-9 text-right">{r.punctuality}%</span>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-white rounded-xl border border-[#E5DED2] p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Package size={15} className="text-[#C8A45D]" />
                  <p className="text-sm font-semibold text-[#1E1E1E]">Объём работы и производительность</p>
                </div>
                <p className="text-xs text-[#8A7E72] leading-5">
                  Подключим iiko — здесь появится объём произведённой продукции по каждому сотруднику и смене,
                  выработка на одну смену и сравнение производительности при одинаковом составе бригады.
                </p>
              </div>
            </div>
          )
        )}

        {/* ============ AUDIT / LOSSES ============ */}
        {tab === "audit" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <StatCard label="Потери за месяц" value={writeoffTotal > 0 ? formatMoney(writeoffTotal) : "—"} tone={writeoffTotal > 0 ? "down" : undefined} />
              <StatCard label="Списаний" value={String(monthWriteoffs.length)} />
              <StatCard label="Причин" value={String(byReason.length)} />
              <StatCard label="Ревизия остатков" value="—" hint="Из iiko" />
            </div>

            {monthWriteoffs.length === 0 ? (
              <div className="bg-white rounded-xl border border-[#E5DED2]"><EmptyState icon={ClipboardList} title="Списаний за месяц нет" description="Потери и брак будут анализироваться здесь: по причинам, по товарам, повторяемость." /></div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border border-[#E5DED2] overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#F7F3EC] flex items-center gap-2">
                    <AlertTriangle size={15} className="text-[#C8A45D]" />
                    <p className="text-sm font-semibold text-[#1E1E1E]">Потери по причинам</p>
                  </div>
                  <div className="divide-y divide-[#F7F3EC]">
                    {byReason.map(([reason, v]) => (
                      <div key={reason} className="flex items-center justify-between px-4 py-2.5">
                        <span className="text-sm text-[#1E1E1E]">{reason} <span className="text-xs text-[#8A7E72]">×{v.count}</span></span>
                        <span className="text-sm font-semibold text-red-500">{formatMoney(v.amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-[#E5DED2] overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#F7F3EC] flex items-center gap-2">
                    <Package size={15} className="text-[#C8A45D]" />
                    <p className="text-sm font-semibold text-[#1E1E1E]">Потери по товарам</p>
                  </div>
                  <div className="divide-y divide-[#F7F3EC]">
                    {byProduct.map(([product, v]) => (
                      <div key={product} className="flex items-center justify-between px-4 py-2.5">
                        <span className="text-sm text-[#1E1E1E]">{product} <span className="text-xs text-[#8A7E72]">×{v.count}</span></span>
                        <span className="text-sm font-semibold text-red-500">{formatMoney(v.amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl border border-[#E5DED2] p-5">
              <div className="flex items-center gap-2 mb-2">
                <ClipboardList size={15} className="text-[#C8A45D]" />
                <p className="text-sm font-semibold text-[#1E1E1E]">Ревизия остатков</p>
              </div>
              <p className="text-xs text-[#8A7E72] leading-5">
                Подключим iiko — здесь будет сверка фактических остатков с расчётными: недостачи, излишки,
                связь с себестоимостью и списаниями.
              </p>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}

function StatCard({ label, value, tone, hint }: { label: string; value: string; tone?: "up" | "down"; hint?: string }) {
  return (
    <div className="bg-white border border-[#E5DED2] rounded-xl p-4">
      <p className="text-[10px] font-semibold text-[#8A7E72] uppercase tracking-wide">{label}</p>
      <div className="flex items-center gap-1.5 mt-1.5">
        <p className={`text-xl font-bold ${value === "—" ? "text-[#C8C0B4]" : tone === "down" ? "text-red-600" : tone === "up" ? "text-green-600" : "text-[#1E1E1E]"}`}>{value}</p>
        {tone === "up" && <TrendingUp size={15} className="text-green-600" />}
        {tone === "down" && <TrendingDown size={15} className="text-red-600" />}
      </div>
      {hint && <p className="text-[10px] text-[#C8C0B4] mt-0.5">{hint}</p>}
    </div>
  );
}
