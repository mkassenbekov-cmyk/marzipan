"use client";
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type {
  Task, Complaint, WriteOff, PurchaseRequest, ShiftRecord, PhotoReport,
  AIRecommendation, SalesData, Employee, SalaryRecord
} from "@/types";
import type { Customer, Debt, Invoice, KaspiPayment, Receipt, PriceEntry, BudgetItem, WhatsAppMessage } from "@/types/business";

interface AppStore {
  tasks: Task[];
  complaints: Complaint[];
  writeOffs: WriteOff[];
  purchaseRequests: PurchaseRequest[];
  shifts: ShiftRecord[];
  photos: PhotoReport[];
  aiRecommendations: AIRecommendation[];
  salesData: SalesData[];
  customers: Customer[];
  debts: Debt[];
  invoices: Invoice[];
  kaspiPayments: KaspiPayment[];
  receipts: Receipt[];
  prices: PriceEntry[];
  budgetItems: BudgetItem[];
  whatsappMessages: WhatsAppMessage[];
  employees: Employee[];
  addEmployee: (e: Omit<Employee, "id">) => Promise<void>;
  updateEmployee: (id: string, patch: Partial<Employee>) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  addTask: (t: Omit<Task, "id">) => Promise<void>;
  addComplaint: (c: Omit<Complaint, "id">) => Promise<void>;
  addWriteOff: (w: Omit<WriteOff, "id">) => Promise<void>;
  addPurchaseRequest: (r: Omit<PurchaseRequest, "id">) => Promise<void>;
  addShift: (s: Omit<ShiftRecord, "id">) => Promise<void>;
  addCustomer: (c: Omit<Customer, "id">) => Promise<void>;
  addInvoice: (inv: Omit<Invoice, "id">) => Promise<void>;
  addKaspiPayment: (p: Omit<KaspiPayment, "id">) => Promise<void>;
  addReceipt: (r: Omit<Receipt, "id">) => Promise<void>;
  updateTask: (id: string, patch: Partial<Task>) => Promise<void>;
  updateComplaint: (id: string, patch: Partial<Complaint>) => Promise<void>;
}

const StoreContext = createContext<AppStore>({} as AppStore);

// Map DB row (snake_case) → app type (camelCase)
const mapTask = (r: Record<string, unknown>): Task => ({
  id: r.id as string,
  title: r.title as string,
  description: r.description as string,
  assignedTo: r.assigned_to as string,
  assignee: r.assigned_to as string,
  assignedBy: r.assigned_by as string,
  dueDate: r.due_date as string,
  priority: r.priority as Task["priority"],
  status: r.status as Task["status"],
  zone: r.zone as string,
});
const mapComplaint = (r: Record<string, unknown>): Complaint => ({
  id: r.id as string,
  client: r.client as string,
  product: r.product as string,
  description: r.description as string,
  reason: r.description as string,
  severity: r.severity as Complaint["severity"],
  status: r.status as Complaint["status"],
  assignedTo: r.assigned_to as string,
  assignee: r.assigned_to as string,
  resolution: r.resolution as string,
  createdAt: r.created_at as string,
});
const mapWriteOff = (r: Record<string, unknown>): WriteOff => ({
  id: r.id as string,
  product: r.product as string,
  quantity: r.quantity as number,
  weight: r.quantity as number,
  unit: r.unit as string,
  reason: r.reason as string,
  zone: r.zone as string,
  responsible: r.responsible as string,
  employee: r.responsible as string,
  shift: r.shift as string,
  amount: r.amount as number,
  date: r.created_at as string,
});
const mapPurchaseRequest = (r: Record<string, unknown>): PurchaseRequest => ({
  id: r.id as string,
  product: r.product as string,
  quantity: r.quantity as string,
  unit: r.unit as string,
  urgency: r.urgency as PurchaseRequest["urgency"],
  zone: r.zone as string,
  requestedBy: r.requested_by as string,
  neededBy: r.needed_by as string,
  status: r.status as PurchaseRequest["status"],
});
const mapShift = (r: Record<string, unknown>): ShiftRecord => ({
  id: r.id as string,
  employee: r.employee as string,
  role: r.role as string,
  date: r.date as string,
  plannedStart: r.planned_start as string,
  actualStart: r.actual_start as string,
  plannedEnd: r.planned_end as string,
  actualEnd: r.actual_end as string,
  late: r.late as number,
  note: r.note as string,
});
const mapCustomer = (r: Record<string, unknown>): Customer => ({
  id: r.id as string,
  name: r.name as string,
  phone: r.phone as string,
  type: r.type as Customer["type"],
  city: r.city as string,
  address: r.address as string,
  contactPerson: r.contact_person as string,
  notes: r.notes as string,
  note: r.notes as string,
  status: r.status as Customer["status"],
});
const mapDebt = (r: Record<string, unknown>): Debt => ({
  id: r.id as string,
  customerId: r.customer_id as string,
  customerName: r.customer_name as string,
  amount: r.amount as number,
  dueDate: r.due_date as string,
  status: r.status as Debt["status"],
  description: r.description as string,
});
const mapInvoice = (r: Record<string, unknown>): Invoice => ({
  id: r.id as string,
  number: r.number as string,
  supplier: r.supplier as string,
  supplierName: r.supplier as string,
  amount: r.amount as number,
  date: r.date as string,
  status: r.status as Invoice["status"],
  items: (r.items as Invoice["items"]) ?? [],
});
const mapKaspiPayment = (r: Record<string, unknown>): KaspiPayment => ({
  id: r.id as string,
  amount: r.amount as number,
  date: r.date as string,
  sender: r.sender as string,
  senderName: r.sender as string,
  description: r.description as string,
  status: r.status as KaspiPayment["status"],
  customerId: r.customer_id as string,
});
const mapEmployee = (r: Record<string, unknown>): Employee => ({
  id: r.id as string,
  name: r.name as string,
  position: r.position as string,
  shiftType: r.shift_type as Employee["shiftType"],
  shiftRate: Number(r.shift_rate ?? 0),
  latePenalty: Number(r.late_penalty ?? 0),
  absencePenalty: Number(r.absence_penalty ?? 0),
  phone: r.phone as string,
  active: r.active as boolean,
  hiredAt: r.hired_at as string,
  note: r.note as string,
});

export function StoreProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [writeOffs, setWriteOffs] = useState<WriteOff[]>([]);
  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>([]);
  const [shifts, setShifts] = useState<ShiftRecord[]>([]);
  const [photos] = useState<PhotoReport[]>([]);
  const [aiRecommendations] = useState<AIRecommendation[]>([]);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [kaspiPayments, setKaspiPayments] = useState<KaspiPayment[]>([]);
  const [receipts] = useState<Receipt[]>([]);
  const [prices] = useState<PriceEntry[]>([]);
  const [budgetItems] = useState<BudgetItem[]>([]);
  const [whatsappMessages] = useState<WhatsAppMessage[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Load all data on mount
  useEffect(() => {
    const load = async () => {
      const [t, c, w, pr, sh, cu, d, inv, kp, sd, emp] = await Promise.all([
        supabase.from("tasks").select("*").order("created_at", { ascending: false }),
        supabase.from("complaints").select("*").order("created_at", { ascending: false }),
        supabase.from("writeoffs").select("*").order("created_at", { ascending: false }),
        supabase.from("purchase_requests").select("*").order("created_at", { ascending: false }),
        supabase.from("shifts").select("*").order("created_at", { ascending: false }),
        supabase.from("customers").select("*").order("created_at", { ascending: false }),
        supabase.from("debts").select("*").order("created_at", { ascending: false }),
        supabase.from("invoices").select("*").order("created_at", { ascending: false }),
        supabase.from("kaspi_payments").select("*").order("created_at", { ascending: false }),
        supabase.from("sales_data").select("*").order("date", { ascending: false }),
        supabase.from("employees").select("*").order("name", { ascending: true }),
      ]);
      if (t.data) setTasks(t.data.map(mapTask));
      if (c.data) setComplaints(c.data.map(mapComplaint));
      if (w.data) setWriteOffs(w.data.map(mapWriteOff));
      if (pr.data) setPurchaseRequests(pr.data.map(mapPurchaseRequest));
      if (sh.data) setShifts(sh.data.map(mapShift));
      if (cu.data) setCustomers(cu.data.map(mapCustomer));
      if (d.data) setDebts(d.data.map(mapDebt));
      if (inv.data) setInvoices(inv.data.map(mapInvoice));
      if (kp.data) setKaspiPayments(kp.data.map(mapKaspiPayment));
      if (sd.data) setSalesData(sd.data.map(r => ({ id: r.id, date: r.date, product: r.product, quantity: r.quantity, revenue: r.revenue, cost: r.cost })));
      if (emp.data) setEmployees(emp.data.map(mapEmployee));
    };
    load();
  }, []);

  const addTask = useCallback(async (t: Omit<Task, "id">) => {
    const { data } = await supabase.from("tasks").insert({
      title: t.title, description: t.description, assigned_to: t.assignedTo ?? t.assignee,
      assigned_by: t.assignedBy, due_date: t.dueDate, priority: t.priority,
      status: t.status, zone: t.zone,
    }).select().single();
    if (data) setTasks(p => [mapTask(data), ...p]);
  }, []);

  const addComplaint = useCallback(async (c: Omit<Complaint, "id">) => {
    const { data } = await supabase.from("complaints").insert({
      client: c.client, product: c.product, description: c.description ?? c.reason,
      severity: c.severity, status: c.status, assigned_to: c.assignedTo ?? c.assignee,
    }).select().single();
    if (data) setComplaints(p => [mapComplaint(data), ...p]);
  }, []);

  const addWriteOff = useCallback(async (w: Omit<WriteOff, "id">) => {
    const { data } = await supabase.from("writeoffs").insert({
      product: w.product, quantity: w.quantity ?? w.weight, unit: w.unit ?? "кг", reason: w.reason,
      zone: w.zone, responsible: w.responsible ?? w.employee, shift: w.shift, amount: w.amount,
    }).select().single();
    if (data) setWriteOffs(p => [mapWriteOff(data), ...p]);
  }, []);

  const addPurchaseRequest = useCallback(async (r: Omit<PurchaseRequest, "id">) => {
    const { data } = await supabase.from("purchase_requests").insert({
      product: r.product, quantity: r.quantity, unit: r.unit, urgency: r.urgency,
      zone: r.zone, requested_by: r.requestedBy, needed_by: r.neededBy, status: r.status,
    }).select().single();
    if (data) setPurchaseRequests(p => [mapPurchaseRequest(data), ...p]);
  }, []);

  const addShift = useCallback(async (s: Omit<ShiftRecord, "id">) => {
    const { data } = await supabase.from("shifts").insert({
      employee: s.employee, role: s.role, date: s.date, planned_start: s.plannedStart,
      actual_start: s.actualStart, planned_end: s.plannedEnd, actual_end: s.actualEnd,
      late: s.late, note: s.note,
    }).select().single();
    if (data) setShifts(p => [mapShift(data), ...p]);
  }, []);

  const addCustomer = useCallback(async (c: Omit<Customer, "id">) => {
    const { data } = await supabase.from("customers").insert({
      name: c.name, phone: c.phone, type: c.type, city: c.city, address: c.address,
      contact_person: c.contactPerson, notes: c.notes ?? c.note, status: c.status,
    }).select().single();
    if (data) setCustomers(p => [mapCustomer(data), ...p]);
  }, []);

  const addInvoice = useCallback(async (inv: Omit<Invoice, "id">) => {
    const isDuplicate = invoices.some(i => i.number === inv.number && i.supplier === inv.supplier);
    const { data } = await supabase.from("invoices").insert({
      number: inv.number, supplier: inv.supplier ?? inv.supplierName, amount: inv.amount,
      date: inv.date, status: isDuplicate ? "duplicate" : inv.status, items: inv.items,
    }).select().single();
    if (data) setInvoices(p => [mapInvoice(data), ...p]);
  }, [invoices]);

  const addKaspiPayment = useCallback(async (pay: Omit<KaspiPayment, "id">) => {
    const { data } = await supabase.from("kaspi_payments").insert({
      amount: pay.amount, date: pay.date, sender: pay.sender ?? pay.senderName,
      description: pay.description ?? pay.note, status: pay.status, customer_id: pay.customerId,
    }).select().single();
    if (data) setKaspiPayments(p => [mapKaspiPayment(data), ...p]);
  }, []);

  const addReceipt = useCallback(async (_r: Omit<Receipt, "id">) => {
    // receipts page uses local state for now
  }, []);

  const addEmployee = useCallback(async (e: Omit<Employee, "id">) => {
    const { data } = await supabase.from("employees").insert({
      name: e.name, position: e.position, shift_type: e.shiftType,
      shift_rate: e.shiftRate, late_penalty: e.latePenalty, absence_penalty: e.absencePenalty,
      phone: e.phone, active: e.active, hired_at: e.hiredAt, note: e.note,
    }).select().single();
    if (data) setEmployees(p => [...p, mapEmployee(data)].sort((a, b) => a.name.localeCompare(b.name)));
  }, []);

  const updateEmployee = useCallback(async (id: string, patch: Partial<Employee>) => {
    await supabase.from("employees").update({
      name: patch.name, position: patch.position, shift_type: patch.shiftType,
      shift_rate: patch.shiftRate, late_penalty: patch.latePenalty, absence_penalty: patch.absencePenalty,
      phone: patch.phone, active: patch.active, hired_at: patch.hiredAt, note: patch.note,
    }).eq("id", id);
    setEmployees(p => p.map(e => e.id === id ? { ...e, ...patch } : e));
  }, []);

  const deleteEmployee = useCallback(async (id: string) => {
    await supabase.from("employees").delete().eq("id", id);
    setEmployees(p => p.filter(e => e.id !== id));
  }, []);

  const updateTask = useCallback(async (id: string, patch: Partial<Task>) => {
    await supabase.from("tasks").update({
      title: patch.title, status: patch.status, priority: patch.priority,
      assigned_to: patch.assignedTo,
    }).eq("id", id);
    setTasks(p => p.map(t => t.id === id ? { ...t, ...patch } : t));
  }, []);

  const updateComplaint = useCallback(async (id: string, patch: Partial<Complaint>) => {
    await supabase.from("complaints").update({
      status: patch.status, resolution: patch.resolution,
    }).eq("id", id);
    setComplaints(p => p.map(c => c.id === id ? { ...c, ...patch } : c));
  }, []);

  return (
    <StoreContext.Provider value={{
      tasks, complaints, writeOffs, purchaseRequests, shifts, photos,
      aiRecommendations, salesData, customers, debts, invoices,
      kaspiPayments, receipts, prices, budgetItems, whatsappMessages, employees,
      addEmployee, updateEmployee, deleteEmployee,
      addTask, addComplaint, addWriteOff, addPurchaseRequest, addShift,
      addCustomer, addInvoice, addKaspiPayment, addReceipt,
      updateTask, updateComplaint,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);
