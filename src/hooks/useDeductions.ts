import { useState, useEffect } from 'react';
import { Deduction, DeductionFormData } from '../types/deduction';
import { supabase } from '../lib/supabase';

export function useDeductions() {
  const [deductions, setDeductions] = useState<Deduction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchDeductions();
  }, []);

  async function fetchDeductions() {
    try {
      const { data, error } = await supabase
        .from('deductions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDeductions(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch deductions'));
    } finally {
      setLoading(false);
    }
  }

  async function addDeduction(data: DeductionFormData) {
    try {
      const { data: newDeduction, error } = await supabase
        .from('deductions')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      setDeductions(prev => [newDeduction, ...prev]);
      return newDeduction;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to add deduction');
    }
  }

  async function updateDeduction(id: string, data: DeductionFormData) {
    try {
      const { data: updated, error } = await supabase
        .from('deductions')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setDeductions(prev => prev.map(deduction => 
        deduction.id === id ? updated : deduction
      ));
      return updated;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update deduction');
    }
  }

  async function deleteDeduction(id: string) {
    try {
      const { error } = await supabase
        .from('deductions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setDeductions(prev => prev.filter(deduction => deduction.id !== id));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete deduction');
    }
  }

  return {
    deductions,
    loading,
    error,
    addDeduction,
    updateDeduction,
    deleteDeduction,
    refresh: fetchDeductions
  };
}