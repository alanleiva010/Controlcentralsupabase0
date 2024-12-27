import { useState, useEffect } from 'react';
import { CashboxBank, CashboxBankFormData } from '../types/cashboxBank';
import { supabase } from '../lib/supabase';

export function useCashboxBanks(cashboxId?: string) {
  const [cashboxBanks, setCashboxBanks] = useState<CashboxBank[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (cashboxId) {
      fetchCashboxBanks();
    }
  }, [cashboxId]);

  async function fetchCashboxBanks() {
    if (!cashboxId) return;

    try {
      const { data, error } = await supabase
        .from('cashbox_banks')
        .select(`
          *,
          bank:banks(id, name)
        `)
        .eq('cashbox_id', cashboxId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCashboxBanks(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch cashbox banks'));
    } finally {
      setLoading(false);
    }
  }

  async function addCashboxBank(data: CashboxBankFormData) {
    if (!cashboxId) return;

    try {
      const { data: newCashboxBank, error } = await supabase
        .from('cashbox_banks')
        .insert([{
          cashbox_id: cashboxId,
          ...data
        }])
        .select()
        .single();

      if (error) throw error;
      setCashboxBanks(prev => [newCashboxBank, ...prev]);
      return newCashboxBank;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to add cashbox bank');
    }
  }

  async function updateCashboxBank(id: string, closing_balance: number) {
    try {
      const { data: updated, error } = await supabase
        .from('cashbox_banks')
        .update({ closing_balance })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setCashboxBanks(prev => prev.map(cb => 
        cb.id === id ? updated : cb
      ));
      return updated;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update cashbox bank');
    }
  }

  return {
    cashboxBanks,
    loading,
    error,
    addCashboxBank,
    updateCashboxBank,
    refresh: fetchCashboxBanks
  };
}