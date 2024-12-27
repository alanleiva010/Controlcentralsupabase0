export type Currency = 'ARS' | 'USD' | 'USDT';

export interface Transaction {
  id: string;
  client_id: string;
  bank_id: string;
  operation_type: string;
  amount: number;
  net_amount: number;
  crypto_amount?: number;
  exchange_rate?: number;
  currency: Currency;
  description?: string;
  created_at: string;
}

export interface TransactionFormData {
  client_id: string;
  bank_id: string;
  operation_type: string;
  amount: number;
  net_amount?: number;
  crypto_amount?: number;
  exchange_rate?: number;
  currency: Currency;
  description?: string;
  deduction_ids?: string[];
}