import { Currency } from '../types/transaction';
import { CashboxBalance } from '../types/cashbox';

export function validateAmount(amount: number): boolean {
  return amount > 0 && Number.isFinite(amount);
}

export function validateCurrency(currency: string): currency is Currency {
  return ['ARS', 'USD', 'USDT'].includes(currency);
}

export function validateCashboxBalance(balance: CashboxBalance): boolean {
  return (
    validateAmount(balance.ARS) &&
    validateAmount(balance.USD) &&
    validateAmount(balance.USDT)
  );
}

export function validateDate(date: string): boolean {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
}