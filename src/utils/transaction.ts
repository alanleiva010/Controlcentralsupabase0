import { Deduction } from '../types/deduction';

export function calculateCryptoAmount(netAmount: number, exchangeRate: number): number {
  return netAmount / exchangeRate;
}

export function calculateNetAmount(amount: number, deductions: Deduction[]): number {
  const totalDeductionPercentage = deductions.reduce((sum, d) => sum + d.percentage, 0);
  const deductionAmount = (amount * totalDeductionPercentage) / 100;
  return amount - deductionAmount;
}