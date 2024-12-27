export interface FinancialData {
  id: string;
  user_id: string;
  amount: number;
  type: 'income' | 'expense';
  description: string;
  created_at: string;
}