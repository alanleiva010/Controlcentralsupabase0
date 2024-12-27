import { useState, useEffect } from 'react';
import { Client, ClientFormData } from '../types/client';
import { supabase } from '../lib/supabase';

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch clients'));
    } finally {
      setLoading(false);
    }
  }

  async function addClient(clientData: ClientFormData) {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([{
          ...clientData,
          // created_by will be set by default on the server
        }])
        .select()
        .single();

      if (error) throw error;
      setClients(prev => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Error adding client:', err);
      throw err instanceof Error ? err : new Error('Failed to add client');
    }
  }

  async function updateClient(id: string, updates: ClientFormData) {
    try {
      const { data, error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setClients(prev => prev.map(client => 
        client.id === id ? data : client
      ));
      return data;
    } catch (err) {
      console.error('Error updating client:', err);
      throw err instanceof Error ? err : new Error('Failed to update client');
    }
  }

  async function deleteClient(id: string) {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setClients(prev => prev.filter(client => client.id !== id));
    } catch (err) {
      console.error('Error deleting client:', err);
      throw err instanceof Error ? err : new Error('Failed to delete client');
    }
  }

  return {
    clients,
    loading,
    error,
    addClient,
    updateClient,
    deleteClient,
    refresh: fetchClients
  };
}