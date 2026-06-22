"use client";
import { useState, useMemo } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { useStore } from "@/lib/store";
import { formatMoney } from "@/lib/utils";
import { Wallet, ChevronLeft, ChevronRight } from "lucide-react";

function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function monthLabel(key: string) {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1).toLocaleDateString("ru-RU", { month: "long", year: "numeric" });
}

export default function SalaryPage() {
  const { employees, shifts } = useStore();
  const [month, setMonth] = useState(monthKey(new Date()));
  // manual per-employee fields keyed by employeeId
  const [manual, setManual] = useState<Record<string, { absences: string; bonus: string }>>({});

  const shiftMonth = (date?: string) => date ? date.slice(0, 7) : "";

  const rows = useMemo(() => {
    return employees.filter(e => e.active).map(e => {
      const empShifts = shifts.filter(s => s.employee === e.name && shiftMonth(s.date) === month);
      const shiftsCount = empShifts.length;
      const latesCount = empShifts.filter(s => s.late && s.late > 0).length;
      const m = manual[e.id] ?? { absences: "", bonus: "" };
      const absences = Number(m.absences) || 0;
      const bonus = Number(m.bonus) || 0;
      const gross = shiftsCount * e.shiftRate;
      const penalties = latesCount * e.latePenalty + absences * e.absencePenalty;
      const net = gross - penalties + bonus;
      return { e, shiftsCount, latesCount, absences, bonus, gross, penalties, net };
    });
  }, [employees, shifts, month, manual]);

  const totalNet = rows.reduce((s, r) => s + r.net, 0);
  const totalGross = rows.reduce((s, r) => s + r.gross, 0);
  const totalPenalties = rows.reduce((s, r) => s + r.penalties, 0);

  const shiftMonth2 = (delta: number) => {
    const [y, m] = month.split("-").map(Number);
    setMonth(monthKey(new Date(y, m - 1 + delta)));
  };

  const setField = (id: string, field: "absences" | "bonus", val: string) => {
    setManual(p => ({ ...p, [id]: { ...(p[id] ?? { absences: "", bonus: "" }), [field]: val } }));
  };

  return (
    <PageShell title="Зарплата">
      <div className="space-y-4">

        {/* Month selector + totals */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white border border-[#E5DED2] rounded-lg px-2 py-1.5">
            <button onClick={() => shiftMonth2(-1)} className="p-1 rounded hover:bg-[#F7F3EC]"><ChevronLeft size={16} className="text-[#8A7E72]" /></button>
            <span className="text-sm font-semibold text-[#1E1E1E] capitalize min-w-[140px] text-center">{monthLabel(month)}</span>
            <button onClick={() => shiftMonth2(1)} className="p-1 rounded hover:bg-[#F7F3EC]"><ChevronRight size={16} className="text-[#8A7E72]" /></button>
          </div>
          <div className="flex gap-3">
            <div className="bg-white border border-[#E5DED2] rounded-lg px-4 py-2">
              <p className="text-xs text-[#8A7E72]">Начислено</p>
              <p className="text-lg font-bold text-[#1E1E1E]">{formatMoney(totalGross)}</p>
            </div>
            <div className="bg-white border border-[#E5DED2] rounded-lg px-4 py-2">
              <p className="text-xs text-[#8A7E72]">Штрафы</p>
              <p className="text-lg font-bold text-red-600">−{formatMoney(totalPenalties)}</p>
            </div>
            <div className="bg-[#2A2521] rounded-lg px-4 py-2">
              <p className="text-xs text-white/50">К выплате</p>
              <p className="text-lg font-bold text-[#C8A45D]">{formatMoney(totalNet)}</p>
            </div>
          </div>
        </div>

        {employees.filter(e => e.active).length === 0 ? (
          <div className="bg-white rounded-xl border border-[#E5DED2]">
            <EmptyState icon={Wallet} title="Нет активных сотрудников"
              description="Добавьте сотрудников со ставкой за смену в разделе «Сотрудники». Зарплата считается по отработанным сменам." />
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[#E5DED2] overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#F7F3EC]">
                <tr className="text-xs text-[#8A7E72] uppercase tracking-wide">
                  <th className="text-left px-4 py-3 font-medium">Сотрудник</th>
                  <th className="text-center px-3 py-3 font-medium">Смены</th>
                  <th className="text-center px-3 py-3 font-medium">Опозд.</th>
                  <th className="text-center px-3 py-3 font-medium">Прогулы</th>
                  <th className="text-center px-3 py-3 font-medium">Премия ₸</th>
                  <th className="text-right px-3 py-3 font-medium">Начислено</th>
                  <th className="text-right px-3 py-3 font-medium">Штрафы</th>
                  <th className="text-right px-4 py-3 font-medium">К выплате</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F7F3EC]">
                {rows.map((r) => (
                  <tr key={r.e.id} className="hover:bg-[#F7F3EC]">
                    <td className="px-4 py-3">
                      <p className="font-medium text-[#1E1E1E]">{r.e.name}</p>
                      <p className="text-xs text-[#8A7E72]">{r.e.position || "—"} · {formatMoney(r.e.shiftRate)}/смена</p>
                    </td>
                    <td className="px-3 py-3 text-center font-semibold text-[#1E1E1E]">{r.shiftsCount}</td>
                    <td className="px-3 py-3 text-center">
                      <span className={r.latesCount > 0 ? "text-yellow-600 font-medium" : "text-[#C8C0B4]"}>{r.latesCount}</span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <input type="number" value={manual[r.e.id]?.absences ?? ""} onChange={e => setField(r.e.id, "absences", e.target.value)}
                        className="w-14 text-center border border-[#E5DED2] rounded px-1 py-1 text-sm outline-none focus:ring-1 focus:ring-[#C8A45D]/40" placeholder="0" />
                    </td>
                    <td className="px-3 py-3 text-center">
                      <input type="number" value={manual[r.e.id]?.bonus ?? ""} onChange={e => setField(r.e.id, "bonus", e.target.value)}
                        className="w-20 text-center border border-[#E5DED2] rounded px-1 py-1 text-sm outline-none focus:ring-1 focus:ring-[#C8A45D]/40" placeholder="0" />
                    </td>
                    <td className="px-3 py-3 text-right text-[#1E1E1E]">{formatMoney(r.gross)}</td>
                    <td className="px-3 py-3 text-right text-red-500">{r.penalties > 0 ? `−${formatMoney(r.penalties)}` : "—"}</td>
                    <td className="px-4 py-3 text-right font-bold text-[#1E1E1E]">{formatMoney(r.net)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-[#F7F3EC] font-semibold">
                  <td className="px-4 py-3 text-[#1E1E1E]" colSpan={5}>Итого к выплате</td>
                  <td className="px-3 py-3 text-right text-[#8A7E72]">{formatMoney(totalGross)}</td>
                  <td className="px-3 py-3 text-right text-red-500">−{formatMoney(totalPenalties)}</td>
                  <td className="px-4 py-3 text-right text-[#1E1E1E] text-base">{formatMoney(totalNet)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        <p className="text-xs text-[#8A7E72]">
          Смены и опоздания берутся автоматически из раздела «Смены». Прогулы и премии вводятся вручную.
          Когда подключим WhatsApp-группу «Сотрудники» — приход будет фиксироваться автоматически.
        </p>
      </div>
    </PageShell>
  );
}
