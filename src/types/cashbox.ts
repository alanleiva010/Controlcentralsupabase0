import { Currency } from './transaction';

export interface CashboxBalance {
  [key in Currency]: number;
}

export interface CashboxBankBalance {
  bank_id: string;
  ARS: number;
  USD: number;
  USDT: number;
}

export interface Cashbox {
  id: string;
  date: string;
  bank_ids: string[];
  status: 'open' | 'closed';
  created_at: string;
  cashbox_bank_balances?: CashboxBankBalance[];
}

export interface CashboxFormData {
  date: string;
  bank_ids: string[];
  bank_balances: {
    [key: string]: CashboxBalance;
  };
}