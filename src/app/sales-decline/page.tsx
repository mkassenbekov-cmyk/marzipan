"use client";
import { PageShell } from "@/components/layout/page-shell";
import { EmptyState } from "@/components/ui/empty-state";
import { useStore } from "@/lib/store";
import { TrendingDown } from "lucide-react";

export default function SalesDeclinePage() {
  const { salesData, customers } = useStore();

  return (
    <PageShell title="Спад продаж">
      <div className="space-y-4">
        <div className="bg-white rounded-xl border border-[#E5DED2] p-4">
          <p className="text-sm text-[#8A7E72]">
            Система автоматически анализирует снижение продаж по товарам, категориям и заказчикам
            при наличии данных из iiko за два и более периода.
          </p>
        </div>

        {salesData.length < 2 ? (
          <div className="bg-white rounded-xl border border-[#E5DED2]">
            <EmptyState
              icon={TrendingDown}
              title="Недостаточно данных"
              description="Для анализа спада нужны продажи минимум за 2 периода. Импортируйте данные из iiko."
            />
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[#E5DED2] p-6">
            <p className="text-sm text-[#8A7E72]">Анализ будет доступен после накопления данных.</p>
          </div>
        )}

        <div className="bg-white rounded-xl border border-[#E5DED2] p-5">
          <p className="text-sm font-semibold text-[#1E1E1E] mb-3">Что будет отслеживаться</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              "Товары с падением спроса", "Заказчики, снизившие закуп",
              "Когда началось снижение", "Возможная причина снижения",
              "Влияние цены на продажи", "Влияние задолженности",
              "Товары без движения", "Сезонные отклонения",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-[#8A7E72]">
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
