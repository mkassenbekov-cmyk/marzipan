"use client";
import { useState } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { Camera, CheckCircle2, XCircle, Upload } from "lucide-react";

const photoTypes = [
  { id: "zone", label: "Чистая рабочая зона", required: true, submitted: true },
  { id: "product", label: "Готовая продукция", required: true, submitted: true },
  { id: "prep", label: "Заготовки", required: true, submitted: false },
  { id: "labels", label: "Маркировки", required: true, submitted: false },
  { id: "fridge", label: "Холодильники", required: true, submitted: false },
  { id: "writeoff", label: "Списания", required: false, submitted: false },
  { id: "delivery", label: "Прием товара", required: false, submitted: false },
  { id: "cleaning", label: "Уборка", required: true, submitted: false },
  { id: "readiness", label: "Готовность на завтра", required: true, submitted: false },
];

export default function PhotosPage() {
  const [types, setTypes] = useState(photoTypes);
  const done = types.filter(t => t.submitted).length;

  return (
    <PageShell title="Фотоотчеты">
      <div className="space-y-4">
        <div className="bg-white rounded-xl border border-[#E5DED2] p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-[#1E1E1E]">Прогресс сдачи: {done}/{types.length}</p>
            <div className="w-48 bg-[#F7F3EC] rounded-full h-2 mt-2">
              <div className="h-2 rounded-full bg-[#C8A45D] transition-all" style={{ width: `${(done / types.length) * 100}%` }} />
            </div>
          </div>
          <Badge variant={done === types.length ? "success" : done > 0 ? "warning" : "danger"}>
            {done === types.length ? "Все сдано" : `Осталось: ${types.length - done}`}
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {types.map((t) => (
            <div key={t.id} className={`bg-white rounded-xl border-2 p-4 transition-colors ${
              t.submitted ? "border-green-200" : t.required ? "border-[#E5DED2] hover:border-[#C8A45D]" : "border-[#F7F3EC]"
            }`}>
              <div className="flex items-start justify-between mb-3">
                <p className="text-sm font-medium text-[#1E1E1E]">{t.label}</p>
                {t.required && !t.submitted && <span className="text-[10px] text-red-500 font-medium">Обязательно</span>}
              </div>

              {t.submitted ? (
                <div className="flex items-center gap-2">
                  <div className="w-16 h-16 bg-green-50 rounded-lg flex items-center justify-center">
                    <CheckCircle2 size={24} className="text-green-500" />
                  </div>
                  <div>
                    <p className="text-xs text-green-700 font-medium">Фото сдано</p>
                    <p className="text-xs text-[#8A7E72]">08:32</p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setTypes(prev => prev.map(p => p.id === t.id ? { ...p, submitted: true } : p))}
                  className="w-full flex flex-col items-center gap-2 py-4 border-2 border-dashed border-[#E5DED2] rounded-lg hover:border-[#C8A45D] hover:bg-[#F7F3EC] transition-colors"
                >
                  <Upload size={20} className="text-[#8A7E72]" />
                  <span className="text-xs text-[#8A7E72]">Загрузить фото</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
