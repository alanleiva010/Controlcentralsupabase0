import { useState, useEffect } from 'react';
import { Bank, BankFormData } from '../types/bank';
import { supabase } from '../lib/supabase';

export function useBanks() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchBanks();
  }, []);

  async function fetchBanks() {
    try {
      const { data, error } = await supabase
        .from('banks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBanks(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch banks'));
    } finally {
      setLoading(false);
    }
  }

  async function addBank(data: BankFormData) {
    try {
      // Check for duplicate SWIFT code if one is provided
      if (data.swift_code) {
        const { data: existing } = await supabase
          .from('banks')
          .select('id')
          .eq('swift_code', data.swift_code)
          .single();

        if (existing) {
          throw new Error('A bank with this SWIFT code already exists');
        }
      }

      const { data: newBank, error } = await supabase
        .from('banks')
        .insert([data])
        .select()
        .single();

      if (error) {
        // Handle specific database errors
        if (error.code === '23505') {
          throw new Error('A bank with this SWIFT code already exists');
        }
        throw error;
      }

      setBanks(prev => [newBank, ...prev]);
      return newBank;
    } catch (err) {
      console.error('Failed to add bank:', err);
      throw err instanceof Error ? err : new Error('Failed to add bank');
    }
  }

  async function updateBank(id: string, data: BankFormData) {
    try {
      // Check for duplicate SWIFT code if one is provided
      if (data.swift_code) {
        const { data: existing } = await supabase
          .from('banks')
          .select('id')
          .eq('swift_code', data.swift_code)
          .neq('id', id) // Exclude current bank
          .single();

        if (existing) {
          throw new Error('A bank with this SWIFT code already exists');
        }
      }

      const { data: updated, error } = await supabase
        .from('banks')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        // Handle specific database errors
        if (error.code === '23505') {
          throw new Error('A bank with this SWIFT code already exists');
        }
        throw error;
      }

      setBanks(prev => prev.map(bank => 
        bank.id === id ? updated : bank
      ));
      return updated;
    } catch (err) {
      console.error('Failed to update bank:', err);
      throw err instanceof Error ? err : new Error('Failed to update bank');
    }
  }

  async function deleteBank(id: string) {
    try {
      const { error } = await supabase
        .from('banks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setBanks(prev => prev.filter(bank => bank.id !== id));
    } catch (err) {
      console.error('Failed to delete bank:', err);
      throw err instanceof Error ? err : new Error('Failed to delete bank');
    }
  }

  return {
    banks,
    loading,
    error,
    addBank,
    updateBank,
    deleteBank,
    refresh: fetchBanks
  };
}