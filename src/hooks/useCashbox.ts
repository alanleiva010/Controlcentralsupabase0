import { useState, useEffect } from 'react';
import { Cashbox, CashboxFormData } from '../types/cashbox';
import { supabase } from '../lib/supabase';

export function useCashbox() {
  const [cashboxes, setCashboxes] = useState<Cashbox[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchCashboxes();
  }, []);

  async function fetchCashboxes() {
    try {
      const { data, error } = await supabase
        .from('cashbox')
        .select(`
          *,
          cashbox_bank_balances (
            id,
            bank_id,
            opening_balance_ars,
            opening_balance_usd,
            opening_balance_usdt,
            closing_balance_ars,
            closing_balance_usd,
            closing_balance_usdt
          )
        `)
        .order('date', { ascending: false });

      if (error) throw error;
      setCashboxes(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch cashboxes'));
    } finally {
      setLoading(false);
    }
  }

  async function openCashbox(data: CashboxFormData) {
    try {
      // Format bank balances for the RPC call
      const bankBalances = Object.entries(data.bank_balances).map(([bankId, balances]) => ({
        bank_id: bankId,
        opening_balance_ars: balances.ARS || 0,
        opening_balance_usd: balances.USD || 0,
        opening_balance_usdt: balances.USDT || 0
      }));

      const { data: result, error: rpcError } = await supabase.rpc('open_cashbox', {
        p_date: data.date,
        p_bank_ids: data.bank_ids,
        p_bank_balances: bankBalances
      });

      if (rpcError) {
        if (rpcError.message.includes('already an open cashbox')) {
          throw new Error('There is already an open cashbox for this date');
        }
        throw rpcError;
      }

      await fetchCashboxes(); // Refresh the list
      return result;
    } catch (err) {
      console.error('Failed to open cashbox:', err);
      throw err instanceof Error ? err : new Error('Failed to open cashbox');
    }
  }

  async function closeCashbox(id: string) {
    try {
      const { error } = await supabase
        .from('cashbox')
        .update({ status: 'closed' })
        .eq('id', id);

      if (error) throw error;
      await fetchCashboxes(); // Refresh the list
    } catch (err) {
      console.error('Failed to close cashbox:', err);
      throw err instanceof Error ? err : new Error('Failed to close cashbox');
    }
  }

  return {
    cashboxes,
    loading,
    error,
    openCashbox,
    closeCashbox,
    refresh: fetchCashboxes
  };
}