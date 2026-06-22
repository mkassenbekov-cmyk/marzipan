"use client";
import { PageShell } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";
import { Construction } from "lucide-react";

export default function Page() {
  return (
    <PageShell title="Раздел в разработке">
      <Card className="flex flex-col items-center justify-center py-16 text-center">
        <Construction size={48} className="text-[#C8A45D] mb-4" />
        <p className="text-lg font-semibold text-[#1E1E1E]">Раздел в разработке</p>
        <p className="text-sm text-[#8A7E72] mt-2">Этот модуль будет доступен в следующей версии</p>
      </Card>
    </PageShell>
  );
}
