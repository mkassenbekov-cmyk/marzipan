import type { Task, Complaint, WriteOff, PurchaseRequest, ShiftRecord, AIRecommendation, SalesData } from "@/types";

export const mockSalesWeek: SalesData[] = [
  { date: "16 июн", revenue: 312000, kaspi: 287000, orders: 94 },
  { date: "17 июн", revenue: 298000, kaspi: 271000, orders: 88 },
  { date: "18 июн", revenue: 341000, kaspi: 315000, orders: 102 },
  { date: "19 июн", revenue: 267000, kaspi: 248000, orders: 81 },
  { date: "20 июн", revenue: 389000, kaspi: 362000, orders: 117 },
  { date: "21 июн", revenue: 421000, kaspi: 390000, orders: 128 },
  { date: "22 июн", revenue: 356000, kaspi: 331000, orders: 108 },
];

export const mockTasks: Task[] = [
  { id: "1", title: "Проверить граммовки по бейглам с лососем", assignee: "Аскар", dueDate: "22.06", priority: "high", status: "open", source: "Стандарты" },
  { id: "2", title: "Разобраться с повторным списанием авокадо", assignee: "Аскар", dueDate: "22.06", priority: "high", status: "in_progress", source: "Списания" },
  { id: "3", title: "Обновить техкарту хот-дога классик", assignee: "Ерлан", dueDate: "24.06", priority: "medium", status: "open", source: "Себестоимость" },
  { id: "4", title: "Закрыть жалобу клиента #47", assignee: "Аскар", dueDate: "21.06", priority: "high", status: "overdue", source: "Жалобы" },
  { id: "5", title: "Провести ревизию холодильника №2", assignee: "Аскар", dueDate: "23.06", priority: "medium", status: "open", source: "Стандарты" },
  { id: "6", title: "Согласовать закуп муки у нового поставщика", assignee: "Ерлан", dueDate: "25.06", priority: "low", status: "open", source: "Закуп" },
];

export const mockComplaints: Complaint[] = [
  { id: "47", client: "Алия К.", product: "Бейгл с лососем", reason: "Несвежий лосось, запах", assignee: "Аскар", status: "overdue", createdAt: "20.06.2025" },
  { id: "48", client: "Дмитрий Р.", product: "Хот-дог классик", reason: "Холодная булочка", assignee: "Аскар", status: "in_progress", createdAt: "21.06.2025" },
  { id: "49", client: "Гульнара С.", product: "Круассан масляный", reason: "Пересохший, крошится", assignee: "Аскар", status: "new", createdAt: "22.06.2025" },
  { id: "50", client: "Максим В.", product: "Бейгл с курицей", reason: "Мало начинки", assignee: "Аскар", status: "review", createdAt: "22.06.2025", resolution: "Скорректировали граммовку" },
];

export const mockWriteOffs: WriteOff[] = [
  { id: "1", product: "Авокадо", weight: 1.2, amount: 1800, reason: "Перезрело", employee: "Заготовщик Нурлан", shift: "Ночная 21.06", date: "21.06.2025", status: "pending" },
  { id: "2", product: "Семга", weight: 0.4, amount: 2800, reason: "Истек срок", employee: "Аскар", shift: "Дневная 21.06", date: "21.06.2025", status: "approved" },
  { id: "3", product: "Сливочный сыр", weight: 0.6, amount: 720, reason: "Вскрытая упаковка", employee: "Дневной сборщик", shift: "Дневная 20.06", date: "20.06.2025", status: "reviewed" },
  { id: "4", product: "Авокадо", weight: 0.9, amount: 1350, reason: "Перезрело", employee: "Заготовщик Нурлан", shift: "Ночная 20.06", date: "20.06.2025", status: "reviewed" },
];

export const mockPurchaseRequests: PurchaseRequest[] = [
  { id: "1", product: "Авокадо", quantity: "10", unit: "кг", urgency: "critical", requestedBy: "Аскар", zone: "Заготовки", status: "new", neededBy: "23.06.2025" },
  { id: "2", product: "Мука пшеничная в/с", quantity: "50", unit: "кг", urgency: "high", requestedBy: "Пекарь", zone: "Пекарня", status: "approved", neededBy: "23.06.2025", supplier: "AlmaFood" },
  { id: "3", product: "Слюда упаковочная", quantity: "500", unit: "шт", urgency: "normal", requestedBy: "Дневной сборщик", zone: "Сборка", status: "ordered", neededBy: "25.06.2025" },
  { id: "4", product: "Семга с/с", quantity: "5", unit: "кг", urgency: "high", requestedBy: "Заготовщик", zone: "Заготовки", status: "new", neededBy: "23.06.2025" },
  { id: "5", product: "Сосиски говяжьи", quantity: "8", unit: "кг", urgency: "normal", requestedBy: "Заготовщик", zone: "Заготовки", status: "new", neededBy: "24.06.2025" },
];

export const mockShifts: ShiftRecord[] = [
  { id: "1", employee: "Аскар Бекенов", role: "Управляющий", date: "22.06.2025", plannedStart: "07:00", actualStart: "07:05", plannedEnd: "19:00", confirmedByAskar: true },
  { id: "2", employee: "Нурлан Д.", role: "Заготовщик", date: "22.06.2025", plannedStart: "06:00", actualStart: "06:28", plannedEnd: "14:00", late: 28, confirmedByAskar: false },
  { id: "3", employee: "Айгерим С.", role: "Дневной сборщик", date: "22.06.2025", plannedStart: "08:00", actualStart: "08:00", plannedEnd: "16:00", confirmedByAskar: true },
  { id: "4", employee: "Марат К.", role: "Пекарь", date: "22.06.2025", plannedStart: "05:00", actualStart: "05:00", plannedEnd: "13:00", confirmedByAskar: true },
  { id: "5", employee: "Зарина Т.", role: "Уборщица", date: "22.06.2025", plannedStart: "06:00", actualStart: "06:45", plannedEnd: "12:00", late: 45, confirmedByAskar: false },
];

export const mockAIRecommendations: AIRecommendation[] = [
  {
    id: "1",
    type: "risk",
    title: "Повторные списания авокадо — системная проблема",
    body: "За последние 5 дней авокадо списывалось 4 раза на общую сумму 6 450 ₸. Вероятная причина: избыточный закуп или нарушение условий хранения. Рекомендую: снизить объём закупа на 30%, проверить температуру в зоне хранения, назначить ответственного заготовщика.",
    priority: "high",
    module: "Списания",
    createdAt: "22.06.2025 07:00",
  },
  {
    id: "2",
    type: "deviation",
    title: "Выручка в пятницу выше нормы на 18%",
    body: "Пятничные продажи стабильно выше среднедневного показателя. Рекомендую увеличить заготовки в четверг вечером на 15–20% и обеспечить дополнительный запас упаковки.",
    priority: "medium",
    module: "Продажи",
    createdAt: "22.06.2025 07:00",
  },
  {
    id: "3",
    type: "task",
    title: "Жалоба #47 просрочена 2 дня",
    body: "Жалоба на свежесть лосося остаётся без закрытия. Необходимо: описать причину, зафиксировать решение и закрыть карточку. Ответственный — Аскар.",
    priority: "high",
    module: "Жалобы",
    createdAt: "22.06.2025 07:00",
  },
  {
    id: "4",
    type: "insight",
    title: "Себестоимость бейгла с лососем выросла на 12%",
    body: "Закупочная цена семги выросла с 2 800 до 3 200 ₸/кг. Текущая маржа продукта снизилась до 38%. Рекомендую: пересмотреть цену продажи или найти альтернативного поставщика.",
    priority: "medium",
    module: "Себестоимость",
    createdAt: "22.06.2025 07:00",
  },
];

export const mockInventory = [
  { product: "Авокадо", stock: 0.8, unit: "кг", minStock: 5, status: "critical" },
  { product: "Семга с/с", stock: 1.2, unit: "кг", minStock: 4, status: "critical" },
  { product: "Мука пшеничная", stock: 12, unit: "кг", minStock: 10, status: "warning" },
  { product: "Слюда упаковочная", stock: 85, unit: "шт", minStock: 100, status: "warning" },
  { product: "Сливочный сыр", stock: 3.2, unit: "кг", minStock: 2, status: "ok" },
  { product: "Сосиски говяжьи", stock: 6.5, unit: "кг", minStock: 5, status: "ok" },
  { product: "Масло сливочное", stock: 4.1, unit: "кг", minStock: 3, status: "ok" },
  { product: "Дрожжи сухие", stock: 0.3, unit: "кг", minStock: 0.5, status: "critical" },
];
