import { useState, useEffect } from 'react';
import { Transaction, TransactionFormData } from '../types/transaction';
import { supabase } from '../lib/supabase';

export function useTransactions(cashboxId?: string, onTransactionAdded?: () => void) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, [cashboxId]);

  async function fetchTransactions() {
    try {
      const query = supabase
        .from('transactions')
        .select(`
          *,
          client:clients(name),
          bank:banks(name)
        `)
        .order('created_at', { ascending: false });

      if (cashboxId) {
        query.eq('cashbox_id', cashboxId);
      }

      const { data, error } = await query;
      if (error) throw error;
      setTransactions(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch transactions'));
    } finally {
      setLoading(false);
    }
  }

  async function addTransaction(data: TransactionFormData) {
    try {
      const { data: newTransaction, error } = await supabase
        .from('transactions')
        .insert([{
          client_id: data.client_id,
          bank_id: data.bank_id,
          cashbox_id: data.cashbox_id,
          operation_type: data.operation_type,
          amount: data.amount,
          net_amount: data.net_amount || data.amount,
          crypto_amount: data.crypto_amount,
          exchange_rate: data.exchange_rate,
          currency: data.currency,
          description: data.description,
          deductions: data.deduction_ids ? 
            data.deduction_ids.map(id => ({ id })) : 
            null
        }])
        .select(`
          *,
          client:clients(name),
          bank:banks(name)
        `)
        .single();

      if (error) throw error;
      
      // Add the new transaction to the list immediately
      setTransactions(prev => [newTransaction, ...prev]);
      
      // Notify parent component about the new transaction
      if (onTransactionAdded) {
        onTransactionAdded();
      }
      
      return newTransaction;
    } catch (err) {
      console.error('Transaction error:', err);
      throw err instanceof Error ? err : new Error('Failed to add transaction');
    }
  }

  return {
    transactions,
    loading,
    error,
    addTransaction,
    refresh: fetchTransactions
  };
}