export type UserRole = "owner" | "director" | "admin_chef" | "night_admin" | "collector" | "preparer" | "baker" | "cleaner" | "accountant";

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface MetricCard {
  label: string;
  value: string | number;
  change?: number;
  status?: "good" | "warning" | "danger" | "neutral";
  sub?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  assignedTo?: string;
  assignedBy?: string;
  assignee?: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  status: "open" | "in_progress" | "done" | "overdue";
  zone?: string;
  source?: string;
}

export interface Complaint {
  id: string;
  client: string;
  product?: string;
  reason?: string;
  description?: string;
  assignedTo?: string;
  assignee?: string;
  severity?: "low" | "medium" | "high" | "critical";
  status: "new" | "assigned" | "in_progress" | "review" | "closed" | "overdue";
  createdAt?: string;
  resolution?: string;
}

export interface WriteOff {
  id: string;
  product: string;
  weight?: number;
  quantity?: number;
  unit?: string;
  amount: number;
  reason: string;
  employee?: string;
  responsible?: string;
  zone?: string;
  shift?: string;
  date?: string;
  photo?: string;
  status?: "pending" | "approved" | "reviewed";
}

export interface PurchaseRequest {
  id: string;
  product: string;
  quantity: string;
  unit: string;
  urgency: "critical" | "high" | "normal";
  requestedBy: string;
  zone: string;
  status: "new" | "approved" | "ordered" | "received";
  neededBy: string;
  supplier?: string;
  price?: number;
}

export interface ShiftRecord {
  id: string;
  employee: string;
  role: string;
  date: string;
  plannedStart: string;
  actualStart?: string;
  plannedEnd: string;
  actualEnd?: string;
  late?: number;
  overtime?: number;
  confirmedByAskar?: boolean;
  checkedByErlan?: boolean;
  note?: string;
}

export interface PhotoReport {
  id: string;
  type: "zone" | "product" | "prep" | "labels" | "fridge" | "writeoff" | "delivery" | "cleaning" | "readiness";
  employee: string;
  shift?: string;
  date?: string;
  zone?: string;
  photos: string[];
  status: "pending" | "approved" | "rejected";
  note?: string;
}

export interface AIRecommendation {
  id: string;
  type: "risk" | "deviation" | "task" | "insight";
  title: string;
  body: string;
  priority: "high" | "medium" | "low";
  module: string;
  createdAt: string;
}

export interface Employee {
  id: string;
  name: string;
  position?: string;
  shiftType?: "day" | "night";
  shiftRate: number;
  latePenalty: number;
  absencePenalty: number;
  phone?: string;
  active: boolean;
  hiredAt?: string;
  note?: string;
}

export interface SalaryRecord {
  id: string;
  employeeId: string;
  month: string;
  shiftsCount: number;
  latesCount: number;
  absencesCount: number;
  bonus: number;
  gross: number;
  penalties: number;
  net: number;
  finalized: boolean;
}

export interface SalesData {
  id?: string;
  date: string;
  revenue: number;
  kaspi?: number;
  orders?: number;
  product?: string;
  quantity?: number;
  cost?: number;
}
