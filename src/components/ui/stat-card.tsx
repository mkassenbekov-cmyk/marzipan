import { cn } from "@/lib/utils";
import type { MetricCard } from "@/types";

export function StatCard({ metric }: { metric: MetricCard }) {
  const statusColor = {
    good: "text-green-600",
    warning: "text-yellow-600",
    danger: "text-red-600",
    neutral: "text-[#8A7E72]",
  }[metric.status ?? "neutral"];

  return (
    <div className="bg-white rounded-xl border border-[#E5DED2] p-5 shadow-sm">
      <p className="text-xs font-semibold text-[#8A7E72] uppercase tracking-wide mb-2">{metric.label}</p>
      <p className={cn("text-2xl font-bold text-[#1E1E1E]")}>{metric.value}</p>
      {metric.change !== undefined && (
        <p className={cn("text-xs mt-1", metric.change >= 0 ? "text-green-600" : "text-red-600")}>
          {metric.change >= 0 ? "▲" : "▼"} {Math.abs(metric.change).toFixed(1)}% к прошлой неделе
        </p>
      )}
      {metric.sub && <p className="text-xs text-[#8A7E72] mt-1">{metric.sub}</p>}
    </div>
  );
}
