"use client";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { UserRole } from "@/types";

const ROLE_USERS: { role: UserRole; name: string; desc: string }[] = [
  { role: "owner", name: "Мади", desc: "Собственник — полный доступ, финансы, AI" },
  { role: "director", name: "Ерлан", desc: "Операционный директор" },
  { role: "admin_chef", name: "Аскар", desc: "Управляющий шеф и администратор" },
  { role: "night_admin", name: "Ночной администратор", desc: "Ночная смена, сборка, накладные" },
  { role: "collector", name: "Сборщик", desc: "Сборка, фотоотчеты, задания" },
  { role: "preparer", name: "Заготовщик", desc: "Заготовки, техкарты, списания" },
  { role: "baker", name: "Пекарь", desc: "Выпечка, сырье, план" },
  { role: "cleaner", name: "Уборщица", desc: "Журнал уборки, фотоотчеты" },
  { role: "accountant", name: "Бухгалтер", desc: "ОПиУ, расходы, ФОТ, отчеты" },
];

export default function HomePage() {
  const { user, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) router.push("/dashboard");
  }, [user, router]);

  return (
    <div className="min-h-screen bg-[#F7F3EC] flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-[0.3em] text-[#2A2521] uppercase">MARZIPAN</h1>
          <p className="text-[#8A7E72] tracking-[0.2em] text-sm uppercase mt-2">OS  Platform</p>
          <div className="w-12 h-0.5 bg-[#C8A45D] mx-auto mt-4" />
        </div>

        <div className="bg-white rounded-2xl border border-[#E5DED2] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#F7F3EC]">
            <p className="text-sm font-semibold text-[#1E1E1E]">Выберите профиль для входа</p>
            <p className="text-xs text-[#8A7E72] mt-0.5">MVP — аутентификация по роли</p>
          </div>
          <div className="divide-y divide-[#F7F3EC]">
            {ROLE_USERS.map((u) => (
              <button
                key={u.role}
                onClick={() => login(u.role)}
                className="w-full flex items-center gap-4 px-6 py-3.5 hover:bg-[#F7F3EC] transition-colors text-left group"
              >
                <div className="w-9 h-9 rounded-full bg-[#2A2521] flex items-center justify-center text-[#C8A45D] font-bold text-sm flex-shrink-0">
                  {u.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#1E1E1E]">{u.name}</p>
                  <p className="text-xs text-[#8A7E72] truncate">{u.desc}</p>
                </div>
                <span className="text-[#C8A45D] opacity-0 group-hover:opacity-100 transition-opacity text-lg">→</span>
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-[#8A7E72] mt-6">MARZIPAN OS · MVP 1 · 2025</p>
      </div>
    </div>
  );
}
