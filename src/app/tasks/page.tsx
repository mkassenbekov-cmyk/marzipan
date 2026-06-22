"use client";
import { useState } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { useStore } from "@/lib/store";
import type { Task } from "@/types";
import { Plus, CheckSquare, X } from "lucide-react";

const priorityLabel = { high: "Высокий", medium: "Средний", low: "Низкий" };
const statusLabel = { open: "Открыта", in_progress: "В работе", done: "Готово", overdue: "Просрочена" };
const statusVariant = { open: "neutral", in_progress: "accent", done: "success", overdue: "danger" } as const;
const priorityVariant = { high: "danger", medium: "warning", low: "neutral" } as const;

export default function TasksPage() {
  const { tasks, addTask, updateTask } = useStore();
  const [filter, setFilter] = useState<"all" | "open" | "overdue" | "done">("all");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", assignee: "", dueDate: "", priority: "medium" as Task["priority"], source: "" });

  const filtered = tasks.filter((t) => {
    if (filter === "all") return true;
    if (filter === "open") return t.status === "open" || t.status === "in_progress";
    return t.status === filter;
  });

  const submit = () => {
    if (!form.title || !form.assignee) return;
    addTask({ ...form, status: "open" });
    setForm({ title: "", assignee: "", dueDate: "", priority: "medium", source: "" });
    setShowForm(false);
  };

  return (
    <PageShell title="Задачи">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {(["all", "open", "overdue", "done"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filter === f ? "bg-[#2A2521] text-white" : "bg-white border border-[#E5DED2] text-[#8A7E72] hover:text-[#1E1E1E]"
                }`}
              >
                {f === "all" ? "Все" : f === "open" ? "Активные" : f === "overdue" ? "Просроченные" : "Выполненные"}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#C8A45D] text-white rounded-lg text-sm font-medium hover:bg-[#B8944D] transition-colors"
          >
            <Plus size={16} />
            Новая задача
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Всего", value: tasks.length },
            { label: "Активных", value: tasks.filter(t => t.status === "open" || t.status === "in_progress").length },
            { label: "Просроченных", value: tasks.filter(t => t.status === "overdue").length },
            { label: "Выполнено", value: tasks.filter(t => t.status === "done").length },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-[#E5DED2] p-4">
              <p className="text-xs text-[#8A7E72] uppercase tracking-wide">{s.label}</p>
              <p className="text-2xl font-bold mt-1 text-[#1E1E1E]">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-xl border border-[#C8A45D] p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold text-[#1E1E1E]">Новая задача</p>
              <button onClick={() => setShowForm(false)}><X size={16} className="text-[#8A7E72]" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-xs text-[#8A7E72] block mb-1">Название *</label>
                <input
                  value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30"
                  placeholder="Описание задачи"
                />
              </div>
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Ответственный *</label>
                <input
                  value={form.assignee}
                  onChange={e => setForm(p => ({ ...p, assignee: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30"
                  placeholder="Имя"
                />
              </div>
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Срок</label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30"
                />
              </div>
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Приоритет</label>
                <select
                  value={form.priority}
                  onChange={e => setForm(p => ({ ...p, priority: e.target.value as Task["priority"] }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30"
                >
                  <option value="high">Высокий</option>
                  <option value="medium">Средний</option>
                  <option value="low">Низкий</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-[#8A7E72] block mb-1">Источник</label>
                <input
                  value={form.source}
                  onChange={e => setForm(p => ({ ...p, source: e.target.value }))}
                  className="w-full border border-[#E5DED2] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#C8A45D]/30"
                  placeholder="Жалоба, сверка..."
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={submit} className="px-4 py-2 bg-[#2A2521] text-white rounded-lg text-sm font-medium hover:bg-[#3d3530]">
                Создать задачу
              </button>
              <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-[#F7F3EC] text-[#8A7E72] rounded-lg text-sm">
                Отмена
              </button>
            </div>
          </div>
        )}

        {/* List */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#E5DED2]">
            <EmptyState
              icon={CheckSquare}
              title={tasks.length === 0 ? "Задач пока нет" : "Нет задач по выбранному фильтру"}
              description={tasks.length === 0 ? "Создайте первую задачу или она появится автоматически при выявлении отклонений" : ""}
              action={tasks.length === 0 ? { label: "Создать задачу", onClick: () => setShowForm(true) } : undefined}
            />
          </div>
        ) : (
          <Card>
            <div className="space-y-1">
              {filtered.map((task) => (
                <div key={task.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-[#F7F3EC] transition-colors">
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                    task.priority === "high" ? "bg-red-500" : task.priority === "medium" ? "bg-yellow-500" : "bg-green-500"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1E1E1E]">{task.title}</p>
                    <p className="text-xs text-[#8A7E72] mt-0.5">{task.assignee}{task.dueDate ? ` · ${task.dueDate}` : ""}{task.source ? ` · ${task.source}` : ""}</p>
                  </div>
                  <Badge variant={priorityVariant[task.priority]}>{priorityLabel[task.priority]}</Badge>
                  <Badge variant={statusVariant[task.status]}>{statusLabel[task.status]}</Badge>
                  {task.status !== "done" && (
                    <button
                      onClick={() => updateTask(task.id, { status: "done" })}
                      className="text-xs text-green-600 hover:text-green-800 font-medium"
                    >
                      Закрыть
                    </button>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </PageShell>
  );
}
