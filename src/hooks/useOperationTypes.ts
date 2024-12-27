import { useState, useEffect } from 'react';
import { OperationType, OperationTypeFormData } from '../types/operationType';
import { supabase } from '../lib/supabase';

export function useOperationTypes() {
  const [operationTypes, setOperationTypes] = useState<OperationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchOperationTypes();
  }, []);

  async function fetchOperationTypes() {
    try {
      const { data, error } = await supabase
        .from('operation_types')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOperationTypes(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch operation types'));
    } finally {
      setLoading(false);
    }
  }

  async function addOperationType(data: OperationTypeFormData) {
    try {
      const { data: newType, error } = await supabase
        .from('operation_types')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      setOperationTypes(prev => [newType, ...prev]);
      return newType;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to add operation type');
    }
  }

  async function updateOperationType(id: string, data: OperationTypeFormData) {
    try {
      const { data: updated, error } = await supabase
        .from('operation_types')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setOperationTypes(prev => prev.map(type => 
        type.id === id ? updated : type
      ));
      return updated;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update operation type');
    }
  }

  async function deleteOperationType(id: string) {
    try {
      const { error } = await supabase
        .from('operation_types')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setOperationTypes(prev => prev.filter(type => type.id !== id));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete operation type');
    }
  }

  return {
    operationTypes,
    loading,
    error,
    addOperationType,
    updateOperationType,
    deleteOperationType,
    refresh: fetchOperationTypes
  };
}