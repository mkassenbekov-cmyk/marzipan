"use client";
import { Bell, Search } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export function Topbar({ title }: { title: string }) {
  const { user } = useAuth();
  const now = new Date();
  const dateStr = now.toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <header className="h-16 bg-white border-b border-[#E5DED2] flex items-center justify-between px-6 sticky top-0 z-30">
      <div>
        <h2 className="text-lg font-semibold text-[#1E1E1E]">{title}</h2>
        <p className="text-xs text-[#8A7E72] capitalize">{dateStr}</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A7E72]" />
          <input
            placeholder="Поиск..."
            className="pl-9 pr-4 py-2 text-sm bg-[#F7F3EC] border border-[#E5DED2] rounded-lg outline-none focus:ring-2 focus:ring-[#C8A45D]/30 w-56"
          />
        </div>
        <button className="relative p-2 rounded-lg hover:bg-[#F7F3EC] transition-colors">
          <Bell size={18} className="text-[#8A7E72]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div className="w-8 h-8 rounded-full bg-[#C8A45D] flex items-center justify-center text-white text-sm font-bold">
          {user?.name[0] ?? "?"}
        </div>
      </div>
    </header>
  );
}
