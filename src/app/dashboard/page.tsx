"use client";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { OwnerDashboard } from "@/components/dashboard/owner-dashboard";
import { DirectorDashboard } from "@/components/dashboard/director-dashboard";
import { AskarDashboard } from "@/components/dashboard/askar-dashboard";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/");
  }, [user, router]);

  if (!user) return null;

  const dashboardTitle = {
    owner: "Главная — обзор бизнеса",
    director: "Главная — операционный контроль",
    admin_chef: "Главная — управление цехом",
  }[user.role as string] ?? `Рабочий стол — ${user.name}`;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-56">
        <Topbar title={dashboardTitle} />
        <main className="p-6">
          {user.role === "owner" && <OwnerDashboard />}
          {user.role === "director" && <DirectorDashboard />}
          {user.role === "admin_chef" && <AskarDashboard />}
          {!["owner", "director", "admin_chef"].includes(user.role) && (
            <WorkerDashboard name={user.name} role={user.role} />
          )}
        </main>
      </div>
    </div>
  );
}

function WorkerDashboard({ name, role }: { name: string; role: string }) {
  const roleTaskMap: Record<string, string[]> = {
    night_admin: ["Принять ночную смену", "Проверить заготовки и выпечку", "Собрать заявки до 00:00", "Внести данные в iiko", "Передать смену Аскару"],
    collector: ["Получить задания на сборку", "Отметить выполнение", "Сдать чистую зону", "Отчитаться ночному администратору"],
    preparer: ["Заготовки по техкартам", "Фотоотчет заготовок", "Фиксация списаний", "Заявка на закуп своей зоны", "Сдача чистой зоны"],
    baker: ["Получить план выпечки", "Проверить остатки муки и масла", "Выпечка по техкартам", "Фотоотчет", "Сдача зоны"],
    cleaner: ["Журнал уборки", "Отметить выполненные уборки", "Фотоотчет чистоты", "Отчет Аскару"],
    accountant: ["ОПиУ за период", "Сверка поступлений", "Отчет для Мади"],
  };
  const tasks = roleTaskMap[role] ?? ["Нет задач"];
  return (
    <div className="max-w-lg">
      <div className="bg-white rounded-xl border border-[#E5DED2] p-6">
        <h3 className="text-lg font-semibold text-[#1E1E1E] mb-1">Привет, {name}!</h3>
        <p className="text-sm text-[#8A7E72] mb-5">Ваши задачи на сегодня:</p>
        <div className="space-y-2">
          {tasks.map((t, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-[#F7F3EC] rounded-lg">
              <div className="w-5 h-5 rounded border-2 border-[#E5DED2] flex-shrink-0" />
              <span className="text-sm text-[#1E1E1E]">{t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
