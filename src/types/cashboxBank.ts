export interface CashboxBankBalance {
  id: string;
  cashbox_id: string;
  bank_id: string;
  opening_balance_ars: number;
  opening_balance_usd: number;
  opening_balance_usdt: number;
  closing_balance_ars: number;
  closing_balance_usd: number;
  closing_balance_usdt: number;
  created_at: string;
}

export interface CashboxBankBalanceFormData {
  bank_id: string;
  opening_balance_ars: number;
  opening_balance_usd: number;
  opening_balance_usdt: number;
}