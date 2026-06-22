import { cn } from "@/lib/utils";

type Variant = "success" | "warning" | "danger" | "neutral" | "accent";

const variants: Record<Variant, string> = {
  success: "bg-green-100 text-green-800",
  warning: "bg-yellow-100 text-yellow-800",
  danger: "bg-red-100 text-red-800",
  neutral: "bg-gray-100 text-gray-700",
  accent: "bg-amber-100 text-amber-800",
};

export function Badge({ children, variant = "neutral", className }: {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-xs font-medium", variants[variant], className)}>
      {children}
    </span>
  );
}
