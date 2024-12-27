import React, { useState } from 'react';
import { Layout } from '../Layout';
import { BankForm } from './components/BankForm';
import { BankList } from './components/BankList';
import { useBanks } from '../../hooks/useBanks';
import { Bank, BankFormData } from '../../types/bank';
import { Building2 } from 'lucide-react';

export default function BankManagement() {
  const { banks, loading, error: bankError, addBank, updateBank, deleteBank } = useBanks();
  const [isAdding, setIsAdding] = useState(false);
  const [editingBank, setEditingBank] = useState<Bank | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: BankFormData) => {
    try {
      setError(null);
      if (editingBank) {
        await updateBank(editingBank.id, data);
        setEditingBank(null);
      } else {
        await addBank(data);
        setIsAdding(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save bank');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this bank?')) {
      try {
        setError(null);
        await deleteBank(id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete bank');
      }
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-6">Loading banks...</div>
      </Layout>
    );
  }

  if (bankError) {
    return (
      <Layout>
        <div className="p-6 text-red-600">Error: {bankError.message}</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Banks</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage your bank information
            </p>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="mt-4 sm:mt-0 inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <Building2 className="h-4 w-4 mr-2" />
            Add Bank
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {(isAdding || editingBank) && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {editingBank ? 'Edit Bank' : 'Add New Bank'}
            </h2>
            <BankForm
              onSubmit={handleSubmit}
              initialData={editingBank ?? undefined}
            />
          </div>
        )}

        <div className="mt-6">
          <BankList
            banks={banks}
            onEdit={setEditingBank}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </Layout>
  );
}