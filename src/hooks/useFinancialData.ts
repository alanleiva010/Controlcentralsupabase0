import { useState, useEffect } from 'react';
import { FinancialData } from '../types/financial';
import { supabase } from '../lib/supabase';

export function useFinancialData(userId?: string) {
  const [data, setData] = useState<FinancialData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchFinancialData() {
      try {
        const query = supabase
          .from('financial_data')
          .select('*')
          .order('created_at', { ascending: false });

        if (userId) {
          query.eq('user_id', userId);
        }

        const { data, error } = await query;
        if (error) throw error;
        
        setData(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch financial data'));
      } finally {
        setLoading(false);
      }
    }

    fetchFinancialData();
  }, [userId]);

  return { data, loading, error };
}