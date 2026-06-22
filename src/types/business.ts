export interface Customer {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  note?: string;
  notes?: string;
  type?: "retail" | "wholesale" | "corporate";
  city?: string;
  contactPerson?: string;
  status?: "active" | "inactive" | "risk";
  createdAt?: string;
}

export interface Debt {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  overdueAmount?: number;
  lastOrderDate?: string;
  dueDate?: string;
  description?: string;
  status: "current" | "overdue" | "partial" | "paid" | "active";
}

export interface Invoice {
  id: string;
  number: string;
  supplierId?: string;
  supplier?: string;
  supplierName?: string;
  date: string;
  amount: number;
  actualAmount?: number;
  status: "draft" | "received" | "verified" | "paid" | "dispute" | "duplicate" | "pending";
  photoUrl?: string;
  linkedOrderId?: string;
  discrepancy?: string;
  receivedBy?: string;
  note?: string;
  items?: InvoiceItem[];
}

export interface InvoiceItem {
  name: string;
  qty: number;
  unit: string;
  price: number;
}

export interface KaspiPayment {
  id: string;
  amount: number;
  date: string;
  sender?: string;
  senderName?: string;
  senderPhone?: string;
  description?: string;
  customerId?: string;
  linkedCustomerId?: string;
  linkedOrderId?: string;
  linkedInvoiceId?: string;
  status: "unmatched" | "matched" | "duplicate" | "dispute" | "overpayment" | "underpayment";
  note?: string;
}

export interface Receipt {
  id: string;
  invoiceId?: string;
  supplier?: string;
  supplierName?: string;
  invoiceNumber?: string;
  date: string;
  items: ReceiptItem[];
  totalAmount?: number;
  photoUrl?: string;
  receivedBy?: string;
  status: "pending" | "confirmed" | "discrepancy" | "ok";
  discrepancyNote?: string;
}

export interface ReceiptItem {
  productName: string;
  orderedQty: number;
  receivedQty: number;
  unit: string;
  price: number;
}

export interface PriceEntry {
  id: string;
  productName?: string;
  product?: string;
  basePrice?: number;
  price?: number;
  cost?: number;
  unit?: string;
  category?: string;
  customerId?: string;
  customerName?: string;
  effectiveFrom?: string;
  effectiveTo?: string;
  changedBy?: string;
  reason?: string;
  costPrice?: number;
  margin?: number;
}

export interface BudgetItem {
  id: string;
  category: "purchase" | "salary" | "rent" | "utilities" | "packaging" | "delivery" | "maintenance" | "equipment" | "other";
  name?: string;
  planned: number;
  actual?: number;
  month?: string;
  dueDate?: string;
  status?: "planned" | "paid" | "overdue" | "deferred";
  note?: string;
}

export interface WhatsAppMessage {
  id: string;
  sender: string;
  phone?: string;
  text?: string;
  content?: string;
  photos?: string[];
  timestamp?: string;
  type: "order" | "payment" | "invoice" | "complaint" | "stock" | "report" | "unknown" | "other";
  status: "new" | "processed" | "error" | "duplicate" | "conflict" | "needs_confirm" | "unrecognized";
  linkedRecordId?: string;
  linkedRecordType?: string;
  errorDetail?: string;
  amount?: number;
}
