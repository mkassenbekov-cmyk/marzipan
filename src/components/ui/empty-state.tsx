import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: Props) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-4 text-center", className)}>
      <div className="w-16 h-16 rounded-2xl bg-[#F7F3EC] border border-[#E5DED2] flex items-center justify-center mb-4">
        <Icon size={28} className="text-[#C8A45D]" />
      </div>
      <p className="text-base font-semibold text-[#1E1E1E]">{title}</p>
      <p className="text-sm text-[#8A7E72] mt-1 max-w-xs leading-5">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-5 px-5 py-2.5 bg-[#2A2521] text-white rounded-lg text-sm font-medium hover:bg-[#3d3530] transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
