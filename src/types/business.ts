export interface Customer {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  note?: string;
  status: "active" | "inactive" | "risk";
  createdAt: string;
}

export interface Debt {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  overdueAmount: number;
  lastOrderDate?: string;
  dueDate?: string;
  status: "current" | "overdue" | "partial" | "paid";
}

export interface Invoice {
  id: string;
  number: string;
  supplierId?: string;
  supplierName: string;
  date: string;
  amount: number;
  actualAmount?: number;
  status: "draft" | "received" | "verified" | "paid" | "dispute" | "duplicate";
  photoUrl?: string;
  linkedOrderId?: string;
  discrepancy?: string;
  receivedBy?: string;
  note?: string;
}

export interface KaspiPayment {
  id: string;
  amount: number;
  date: string;
  senderName?: string;
  senderPhone?: string;
  linkedCustomerId?: string;
  linkedOrderId?: string;
  linkedInvoiceId?: string;
  status: "unmatched" | "matched" | "duplicate" | "dispute" | "overpayment" | "underpayment";
  note?: string;
}

export interface Receipt {
  id: string;
  invoiceId?: string;
  supplierName: string;
  date: string;
  items: ReceiptItem[];
  totalAmount: number;
  photoUrl?: string;
  receivedBy: string;
  status: "pending" | "confirmed" | "discrepancy";
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
  productName: string;
  basePrice: number;
  customerId?: string;
  customerName?: string;
  effectiveFrom: string;
  effectiveTo?: string;
  changedBy: string;
  reason?: string;
  costPrice?: number;
  margin?: number;
}

export interface BudgetItem {
  id: string;
  category: "purchase" | "salary" | "rent" | "utilities" | "packaging" | "delivery" | "maintenance" | "equipment" | "other";
  name: string;
  planned: number;
  actual?: number;
  dueDate?: string;
  status: "planned" | "paid" | "overdue" | "deferred";
  note?: string;
}

export interface WhatsAppMessage {
  id: string;
  sender: string;
  phone?: string;
  text: string;
  photos?: string[];
  timestamp: string;
  type: "order" | "payment" | "invoice" | "complaint" | "stock" | "report" | "unknown";
  status: "new" | "processed" | "error" | "duplicate" | "conflict" | "needs_confirm" | "unrecognized";
  linkedRecordId?: string;
  linkedRecordType?: string;
  errorDetail?: string;
}
