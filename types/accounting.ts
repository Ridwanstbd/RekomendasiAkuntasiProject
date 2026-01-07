export type AccountType =
  | "ASSET"
  | "LIABILITY"
  | "EQUITY"
  | "REVENUE"
  | "EXPENSE";

export type JournalType =
  | "GENERAL"
  | "SALES"
  | "PURCHASE"
  | "EXPENSE"
  | "PAYMENT";

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

export interface FinancialRatios {
  bep: number;
  roi: number;
  netProfit: number;
  totalAssets: number;
}

export interface ReportItem {
  id: string;
  title: string;
  description: string;
  icon: any;
  route: string;
  color: string;
}

export interface PLDetail {
  name: string;
  type: "REVENUE" | "EXPENSE";
  balance: number;
}

export interface ProfitLossData {
  details: PLDetail[];
  totalRevenue: number;
  totalExpense: number;
  netProfit: number;
}

export interface BalanceSheetAccount {
  id: string;
  name: string;
  code: string;
  balance: string | number;
}

export interface BalanceSheetSection {
  items: BalanceSheetAccount[];
  total: number;
}

export interface BalanceSheetData {
  assets: BalanceSheetSection;
  liabilities: BalanceSheetSection;
  equity: BalanceSheetSection;
  isBalanced: boolean;
}

export interface LedgerEntry {
  id: string;
  debitAmount: number;
  creditAmount: number;
  journal: {
    id: string;
    reference: string;
    date: string;
    description: string;
  };
  debitAccount?: { id: string; name: string; code: string };
  creditAccount?: { id: string; name: string; code: string };
}

export interface AIRecommendation {
  id: string;
  year: number;
  month: number;
  recommendationType:
    | "CostSaving"
    | "RevenueOptimization"
    | "CashFlow"
    | "General";
  recommendationText: string;
  isCustom: boolean;
  generatedAt: string;
}

export interface RecommendationResponse {
  success: boolean;
  data: AIRecommendation[];
  pagination: {
    total: number;
    totalPages: number;
  };
}

export interface CustomRecommendationRequest {
  prompt: string;
  year?: number;
  month?: number;
  includeFinancialData: boolean;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

export interface BusinessContext {
  id: string;
  name: string;
  code: string;
  role: string;
  isActive: boolean;
}

export interface OwnerData {
  id: string;
  email: string;
  username: string;
  name: string;
  profile: UserProfile;
  globalRoles: string[];
  businesses: BusinessContext[];
}

export interface StaffUser {
  id: string;
  email: string;
  username: string;
  isActive: boolean;
  profile: UserProfile;
  businessUsers: {
    role: { name: string };
  }[];
}
