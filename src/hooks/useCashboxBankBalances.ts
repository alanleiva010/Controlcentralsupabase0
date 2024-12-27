import { useState, useEffect } from 'react';
import { CashboxBankBalance, CashboxBankBalanceFormData } from '../types/cashboxBank';
import { supabase } from '../lib/supabase';

export function useCashboxBankBalances(cashboxId?: string) {
  const [balances, setBalances] = useState<CashboxBankBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (cashboxId) {
      fetchBalances();
    }
  }, [cashboxId]);

  async function fetchBalances() {
    try {
      const { data, error } = await supabase
        .from('cashbox_bank_balances')
        .select(`
          *,
          bank:banks(id, name)
        `)
        .eq('cashbox_id', cashboxId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBalances(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch bank balances'));
    } finally {
      setLoading(false);
    }
  }

  async function updateBalance(id: string, data: Partial<CashboxBankBalanceFormData>) {
    try {
      const { error } = await supabase
        .from('cashbox_bank_balances')
        .update(data)
        .eq('id', id);

      if (error) throw error;
      await fetchBalances();
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update bank balance');
    }
  }

  return {
    balances,
    loading,
    error,
    updateBalance,
    refresh: fetchBalances
  };
}