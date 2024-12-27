import { Currency } from '../types/transaction';

export function formatCurrency(amount: number, currency: Currency): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency === 'USDT' ? 'USD' : currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formatted = formatter.format(amount);
  return currency === 'USDT' ? `${formatted.replace('$', '')} USDT` : formatted;
}

export function calculateNetAmount(amount: number, deductions: { percentage: number }[]): number {
  const totalDeductionPercentage = deductions.reduce((sum, d) => sum + d.percentage, 0);
  const deductionAmount = (amount * totalDeductionPercentage) / 100;
  return amount - deductionAmount;
}

export const CURRENCIES: Currency[] = ['ARS', 'USD', 'USDT'];