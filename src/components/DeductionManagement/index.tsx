import React, { useState } from 'react';
import { Layout } from '../Layout';
import { DeductionForm } from './components/DeductionForm';
import { DeductionList } from './components/DeductionList';
import { useDeductions } from '../../hooks/useDeductions';
import { Deduction, DeductionFormData } from '../../types/deduction';
import { Percent } from 'lucide-react';

export default function DeductionManagement() {
  const { deductions, loading, error, addDeduction, updateDeduction, deleteDeduction } = useDeductions();
  const [isAdding, setIsAdding] = useState(false);
  const [editingDeduction, setEditingDeduction] = useState<Deduction | null>(null);

  const handleSubmit = async (data: DeductionFormData) => {
    try {
      if (editingDeduction) {
        await updateDeduction(editingDeduction.id, data);
        setEditingDeduction(null);
      } else {
        await addDeduction(data);
        setIsAdding(false);
      }
    } catch (error) {
      console.error('Failed to save deduction:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this deduction?')) {
      try {
        await deleteDeduction(id);
      } catch (error) {
        console.error('Failed to delete deduction:', error);
      }
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-6">Loading deductions...</div>
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
            <h1 className="text-2xl font-bold text-gray-900">Deductions</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage your deductions and their percentages
            </p>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="mt-4 sm:mt-0 inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <Percent className="h-4 w-4 mr-2" />
            Add Deduction
          </button>
        </div>

        {(isAdding || editingDeduction) && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {editingDeduction ? 'Edit Deduction' : 'Add New Deduction'}
            </h2>
            <DeductionForm
              onSubmit={handleSubmit}
              initialData={editingDeduction ?? undefined}
            />
          </div>
        )}

        <div className="mt-6">
          <DeductionList
            deductions={deductions}
            onEdit={setEditingDeduction}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </Layout>
  );
}