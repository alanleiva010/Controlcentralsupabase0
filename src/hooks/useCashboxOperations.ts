import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { CashboxFormData } from '../types/cashbox';

export function useCashboxOperations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const openCashbox = async (data: CashboxFormData) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('cashbox')
        .insert([{
          date: data.date,
          opening_balance_ars: data.opening_balance.ARS,
          opening_balance_usd: data.opening_balance.USD,
          opening_balance_usdt: data.opening_balance.USDT,
          status: 'open'
        }]);

      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to open cashbox'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const closeCashbox = async (id: string, closing_balance: CashboxFormData['opening_balance']) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('cashbox')
        .update({
          closing_balance_ars: closing_balance.ARS,
          closing_balance_usd: closing_balance.USD,
          closing_balance_usdt: closing_balance.USDT,
          status: 'closed'
        })
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to close cashbox'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    openCashbox,
    closeCashbox
  };
}