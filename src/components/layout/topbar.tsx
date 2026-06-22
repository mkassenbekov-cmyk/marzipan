"use client";
import { Bell, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

export function Topbar({ title }: { title: string }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const now = new Date();
  const dateStr = now.toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <header className="h-16 bg-white border-b border-[#E5DED2] flex items-center justify-between px-6 sticky top-0 z-30">
      <div>
        <h2 className="text-lg font-semibold text-[#1E1E1E]">{title}</h2>
        <p className="text-xs text-[#8A7E72] capitalize">{dateStr}</p>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-lg hover:bg-[#F7F3EC] transition-colors">
          <Bell size={18} className="text-[#8A7E72]" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#C8A45D] flex items-center justify-center text-white text-sm font-bold">
            {user?.name[0] ?? "?"}
          </div>
          <span className="text-sm text-[#1E1E1E] font-medium hidden md:block">{user?.name}</span>
        </div>
        <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-[#F7F3EC] transition-colors" title="Выйти">
          <LogOut size={16} className="text-[#8A7E72]" />
        </button>
      </div>
    </header>
  );
}
