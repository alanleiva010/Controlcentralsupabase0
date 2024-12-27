import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { TransactionFormData } from '../types/transaction';
import { calculateNetAmount } from '../utils/currency';

export function useTransactionOperations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createTransaction = async (data: TransactionFormData, cashboxId: string) => {
    setLoading(true);
    try {
      // Calculate net amount with deductions
      let deductions = [];
      let net_amount = data.amount;

      if (data.deduction_ids?.length) {
        const { data: deductionsData, error: deductionsError } = await supabase
          .from('deductions')
          .select('*')
          .in('id', data.deduction_ids);

        if (deductionsError) throw deductionsError;
        deductions = deductionsData;
        net_amount = calculateNetAmount(data.amount, deductions);
      }

      const { error } = await supabase
        .from('transactions')
        .insert([{
          ...data,
          cashbox_id: cashboxId,
          deductions: deductions.length ? deductions : null,
          net_amount
        }]);

      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create transaction'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createTransaction
  };
}