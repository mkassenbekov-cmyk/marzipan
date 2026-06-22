import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMoney(amount: number): string {
  return new Intl.NumberFormat("ru-RU", { style: "decimal", maximumFractionDigits: 0 }).format(amount) + " ₸";
}

export function formatPercent(value: number): string {
  return (value > 0 ? "+" : "") + value.toFixed(1) + "%";
}
