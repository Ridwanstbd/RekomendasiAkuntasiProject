export type AccountType =
  | "ASSET"
  | "LIABILITY"
  | "EQUITY"
  | "REVENUE"
  | "EXPENSE";

export type JournalType = "GENERAL" | "SALES" | "PURCHASE" | "PAYMENT";

export type JournalStatus = "DRAFT" | "POSTED" | "CANCELLED";

export type SaleStatus = "PENDING" | "PAID" | "CANCELLED";

export interface Account {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  balance: number;
  businessId: string;
}

export interface Customer {
  id: string;
  code?: string;
  name: string;
  phone?: string;
  address?: string;
}

/**
 * JOURNAL & TRANSACTIONS
 */

export interface JournalEntry {
  id?: string;
  journalId?: string;
  debitAccountId: string | null;
  creditAccountId: string | null;
  description: string;
  debitAmount: number;
  creditAmount: number;
  // Relationship detail (optional)
  debitAccount?: Account;
  creditAccount?: Account;
}

export interface Journal {
  id: string;
  journalNo: string;
  date: string;
  reference: string;
  type: JournalType;
  totalAmount: number;
  status: JournalStatus;
  entries?: JournalEntry[];
}

/**
 * SALES & PURCHASE PAYLOADS
 */

export interface SaleItem {
  productName: string;
  quantity: number;
  price: number;
  amount?: number;
}

export interface SalePayload {
  customerId: string;
  date: string;
  tax: number;
  items: SaleItem[];
}

export interface JournalPayload {
  date: string;
  type: JournalType;
  reference: string;
  entries: {
    debitAccountId: string | null;
    creditAccountId: string | null;
    description: string;
    debitAmount: number;
    creditAmount: number;
  }[];
}

/**
 * API RESPONSES WRAPPER
 */

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
