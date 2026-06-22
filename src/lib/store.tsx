"use client";
import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import type {
  Task, Complaint, WriteOff, PurchaseRequest, ShiftRecord, PhotoReport,
  AIRecommendation, SalesData
} from "@/types";
import type { Customer, Debt, Invoice, KaspiPayment, Receipt, PriceEntry, BudgetItem, WhatsAppMessage } from "@/types/business";

interface AppStore {
  // Core data
  tasks: Task[];
  complaints: Complaint[];
  writeOffs: WriteOff[];
  purchaseRequests: PurchaseRequest[];
  shifts: ShiftRecord[];
  photos: PhotoReport[];
  aiRecommendations: AIRecommendation[];
  salesData: SalesData[];
  // Business data
  customers: Customer[];
  debts: Debt[];
  invoices: Invoice[];
  kaspiPayments: KaspiPayment[];
  receipts: Receipt[];
  prices: PriceEntry[];
  budgetItems: BudgetItem[];
  whatsappMessages: WhatsAppMessage[];
  // Mutations
  addTask: (t: Omit<Task, "id">) => void;
  addComplaint: (c: Omit<Complaint, "id">) => void;
  addWriteOff: (w: Omit<WriteOff, "id">) => void;
  addPurchaseRequest: (r: Omit<PurchaseRequest, "id">) => void;
  addShift: (s: Omit<ShiftRecord, "id">) => void;
  addCustomer: (c: Omit<Customer, "id">) => void;
  addInvoice: (inv: Omit<Invoice, "id">) => void;
  addKaspiPayment: (p: Omit<KaspiPayment, "id">) => void;
  addReceipt: (r: Omit<Receipt, "id">) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  updateComplaint: (id: string, patch: Partial<Complaint>) => void;
}

const StoreContext = createContext<AppStore>({} as AppStore);

let idCounter = 1;
const uid = () => String(idCounter++);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [writeOffs, setWriteOffs] = useState<WriteOff[]>([]);
  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>([]);
  const [shifts, setShifts] = useState<ShiftRecord[]>([]);
  const [photos, setPhotos] = useState<PhotoReport[]>([]);
  const [aiRecommendations] = useState<AIRecommendation[]>([]);
  const [salesData] = useState<SalesData[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [kaspiPayments, setKaspiPayments] = useState<KaspiPayment[]>([]);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [prices, setPrices] = useState<PriceEntry[]>([]);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [whatsappMessages, setWhatsappMessages] = useState<WhatsAppMessage[]>([]);

  const addTask = useCallback((t: Omit<Task, "id">) => setTasks(p => [...p, { ...t, id: uid() }]), []);
  const addComplaint = useCallback((c: Omit<Complaint, "id">) => setComplaints(p => [...p, { ...c, id: uid() }]), []);
  const addWriteOff = useCallback((w: Omit<WriteOff, "id">) => setWriteOffs(p => [...p, { ...w, id: uid() }]), []);
  const addPurchaseRequest = useCallback((r: Omit<PurchaseRequest, "id">) => setPurchaseRequests(p => [...p, { ...r, id: uid() }]), []);
  const addShift = useCallback((s: Omit<ShiftRecord, "id">) => setShifts(p => [...p, { ...s, id: uid() }]), []);
  const addCustomer = useCallback((c: Omit<Customer, "id">) => setCustomers(p => [...p, { ...c, id: uid() }]), []);
  const addInvoice = useCallback((inv: Omit<Invoice, "id">) => setInvoices(p => [...p, { ...inv, id: uid() }]), []);
  const addKaspiPayment = useCallback((pay: Omit<KaspiPayment, "id">) => setKaspiPayments(p => [...p, { ...pay, id: uid() }]), []);
  const addReceipt = useCallback((r: Omit<Receipt, "id">) => setReceipts(p => [...p, { ...r, id: uid() }]), []);
  const updateTask = useCallback((id: string, patch: Partial<Task>) => setTasks(p => p.map(t => t.id === id ? { ...t, ...patch } : t)), []);
  const updateComplaint = useCallback((id: string, patch: Partial<Complaint>) => setComplaints(p => p.map(c => c.id === id ? { ...c, ...patch } : c)), []);

  return (
    <StoreContext.Provider value={{
      tasks, complaints, writeOffs, purchaseRequests, shifts, photos,
      aiRecommendations, salesData, customers, debts, invoices,
      kaspiPayments, receipts, prices, budgetItems, whatsappMessages,
      addTask, addComplaint, addWriteOff, addPurchaseRequest, addShift,
      addCustomer, addInvoice, addKaspiPayment, addReceipt,
      updateTask, updateComplaint,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);
