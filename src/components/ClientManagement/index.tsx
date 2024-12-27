import React, { useState } from 'react';
import { Layout } from '../Layout';
import { ClientForm } from './components/ClientForm';
import { ClientList } from './components/ClientList';
import { useClients } from '../../hooks/useClients';
import { Client, ClientFormData } from '../../types/client';
import { UserPlus } from 'lucide-react';

export default function ClientManagement() {
  const { clients, loading, error, addClient, updateClient, deleteClient } = useClients();
  const [isAdding, setIsAdding] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const handleSubmit = async (data: ClientFormData) => {
    try {
      if (editingClient) {
        await updateClient(editingClient.id, data);
        setEditingClient(null);
      } else {
        await addClient(data);
        setIsAdding(false);
      }
    } catch (error) {
      console.error('Failed to save client:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await deleteClient(id);
      } catch (error) {
        console.error('Failed to delete client:', error);
      }
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-6">Loading clients...</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="p-6 text-red-600">Error: {error.message}</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage your client information
            </p>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="mt-4 sm:mt-0 inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Client
          </button>
        </div>

        {(isAdding || editingClient) && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {editingClient ? 'Edit Client' : 'Add New Client'}
            </h2>
            <ClientForm
              onSubmit={handleSubmit}
              initialData={editingClient ?? undefined}
            />
          </div>
        )}

        <div className="mt-6">
          <ClientList
            clients={clients}
            onEdit={setEditingClient}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </Layout>
  );
}