"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import type { UserRole } from "@/types";
import {
  LayoutDashboard, TrendingUp, CreditCard, Package, Clock, Users,
  ShoppingCart, Archive, Trash2, AlertCircle, Camera, BookOpen,
  ClipboardList, ChefHat, Lightbulb, FileText, Settings, LogOut, Star,
  CheckSquare, MessageCircle, ArrowDownToLine, DollarSign, Scale,
  BarChart3, PiggyBank, TrendingDown, FileCheck, UserCheck, Receipt, Wallet
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  roles?: UserRole[];
  group?: string;
}

const navItems: NavItem[] = [
  // Главная
  { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={16} />, group: "Главная" },

  // Данные и интеграции
  { href: "/sales", label: "Продажи", icon: <TrendingUp size={16} />, group: "Данные", roles: ["owner", "director", "accountant"] },
  { href: "/kaspi-pay", label: "Kaspi Pay", icon: <CreditCard size={16} />, group: "Данные" },
  { href: "/iiko", label: "iiko", icon: <Package size={16} />, group: "Данные", roles: ["owner", "director", "accountant"] },
  { href: "/whatsapp", label: "WhatsApp", icon: <MessageCircle size={16} />, group: "Данные" },

  // Товар и склад
  { href: "/receipts", label: "Приходы товара", icon: <ArrowDownToLine size={16} />, group: "Склад" },
  { href: "/invoices", label: "Накладные", icon: <FileCheck size={16} />, group: "Склад" },
  { href: "/inventory", label: "Остатки", icon: <Archive size={16} />, group: "Склад" },
  { href: "/purchase", label: "Закуп", icon: <ShoppingCart size={16} />, group: "Склад" },
  { href: "/prices", label: "Цены", icon: <DollarSign size={16} />, group: "Склад", roles: ["owner", "director", "admin_chef"] },

  // Финансы
  { href: "/customers", label: "Заказчики", icon: <UserCheck size={16} />, group: "Финансы", roles: ["owner", "director", "accountant"] },
  { href: "/debts", label: "Долги", icon: <Receipt size={16} />, group: "Финансы", roles: ["owner", "director", "accountant"] },
  { href: "/reconciliation", label: "Сверка данных", icon: <Scale size={16} />, group: "Финансы", roles: ["owner", "director", "accountant"] },
  { href: "/budget", label: "Бюджет", icon: <PiggyBank size={16} />, group: "Финансы", roles: ["owner", "director", "accountant"] },
  { href: "/sales-decline", label: "Спад продаж", icon: <TrendingDown size={16} />, group: "Финансы", roles: ["owner", "director"] },

  // Операции
  { href: "/shifts", label: "Смены", icon: <Clock size={16} />, group: "Операции" },
  { href: "/employees", label: "Сотрудники", icon: <Users size={16} />, group: "Операции", roles: ["owner", "director", "admin_chef"] },
  { href: "/salary", label: "Зарплата", icon: <Wallet size={16} />, group: "Операции", roles: ["owner", "director", "admin_chef", "accountant"] },
  { href: "/writeoffs", label: "Списания", icon: <Trash2 size={16} />, group: "Операции" },
  { href: "/complaints", label: "Жалобы", icon: <AlertCircle size={16} />, group: "Операции" },
  { href: "/photos", label: "Фотоотчеты", icon: <Camera size={16} />, group: "Операции" },

  // Стандарты
  { href: "/standards", label: "Стандарты", icon: <BookOpen size={16} />, group: "Стандарты" },
  { href: "/inspection", label: "Журнал обхода", icon: <ClipboardList size={16} />, group: "Стандарты" },
  { href: "/recipes", label: "Техкарты", icon: <ChefHat size={16} />, group: "Стандарты" },
  { href: "/new-product", label: "Новый продукт", icon: <Star size={16} />, group: "Стандарты" },

  // Управление
  { href: "/tasks", label: "Задачи", icon: <CheckSquare size={16} />, group: "Управление" },
  { href: "/ai", label: "AI-аналитика", icon: <Lightbulb size={16} />, group: "Управление", roles: ["owner", "director"] },
  { href: "/reports", label: "Отчеты", icon: <FileText size={16} />, group: "Управление", roles: ["owner", "director", "accountant"] },
  { href: "/settings", label: "Настройки", icon: <Settings size={16} />, group: "Управление", roles: ["owner"] },
];

const GROUPS = ["Главная", "Данные", "Склад", "Финансы", "Операции", "Стандарты", "Управление"];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const visibleItems = navItems.filter(
    (item) => !item.roles || !user || item.roles.includes(user.role)
  );

  return (
    <aside className="fixed left-0 top-0 h-screen w-56 bg-[#2A2521] flex flex-col z-40 overflow-hidden">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10 flex-shrink-0">
        <h1 className="text-white font-bold tracking-[0.2em] text-sm uppercase">MARZIPAN</h1>
        <p className="text-white/40 text-[10px] tracking-[0.15em] uppercase mt-0.5">OS Platform</p>
      </div>

      {/* User info */}
      {user && (
        <div className="px-4 py-3 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#C8A45D] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user.name[0]}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-medium truncate">{user.name}</p>
              <p className="text-white/40 text-[10px] truncate">{roleLabel(user.role)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 px-2">
        {GROUPS.map((group) => {
          const items = visibleItems.filter((i) => i.group === group);
          if (items.length === 0) return null;
          return (
            <div key={group} className="mb-1">
              <p className="text-white/25 text-[9px] font-semibold uppercase tracking-widest px-3 py-1.5">{group}</p>
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-1.5 rounded-lg mb-0.5 text-xs transition-colors",
                    pathname.startsWith(item.href)
                      ? "bg-[#C8A45D]/20 text-[#C8A45D]"
                      : "text-white/55 hover:text-white hover:bg-white/5"
                  )}
                >
                  {item.icon}
                  <span className="truncate">{item.label}</span>
                </Link>
              ))}
            </div>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-2 py-3 border-t border-white/10 flex-shrink-0">
        <button
          onClick={logout}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-white/35 hover:text-white hover:bg-white/5 text-xs w-full transition-colors"
        >
          <LogOut size={14} />
          <span>Выйти</span>
        </button>
      </div>
    </aside>
  );
}

function roleLabel(role: UserRole): string {
  const map: Record<UserRole, string> = {
    owner: "Собственник",
    director: "Опер. директор",
    admin_chef: "Управляющий",
    night_admin: "Ночной адм.",
    collector: "Сборщик",
    preparer: "Заготовщик",
    baker: "Пекарь",
    cleaner: "Уборщица",
    accountant: "Бухгалтер",
  };
  return map[role];
}
