import React, { useState } from 'react';
import { Layout } from '../Layout';
import { OperationTypeForm } from './components/OperationTypeForm';
import { OperationTypeList } from './components/OperationTypeList';
import { useOperationTypes } from '../../hooks/useOperationTypes';
import { OperationType, OperationTypeFormData } from '../../types/operationType';
import { Plus } from 'lucide-react';

export default function OperationTypesManagement() {
  const { operationTypes, loading, error, addOperationType, updateOperationType, deleteOperationType } = useOperationTypes();
  const [isAdding, setIsAdding] = useState(false);
  const [editingType, setEditingType] = useState<OperationType | null>(null);

  const handleSubmit = async (data: OperationTypeFormData) => {
    try {
      if (editingType) {
        await updateOperationType(editingType.id, data);
        setEditingType(null);
      } else {
        await addOperationType(data);
        setIsAdding(false);
      }
    } catch (error) {
      console.error('Failed to save operation type:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this operation type?')) {
      try {
        await deleteOperationType(id);
      } catch (error) {
        console.error('Failed to delete operation type:', error);
      }
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-6">Loading operation types...</div>
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
            <h1 className="text-2xl font-bold text-gray-900">Operation Types</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage your operation types
            </p>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="mt-4 sm:mt-0 inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Operation Type
          </button>
        </div>

        {(isAdding || editingType) && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {editingType ? 'Edit Operation Type' : 'Add New Operation Type'}
            </h2>
            <OperationTypeForm
              onSubmit={handleSubmit}
              initialData={editingType ?? undefined}
            />
          </div>
        )}

        <div className="mt-6">
          <OperationTypeList
            operationTypes={operationTypes}
            onEdit={setEditingType}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </Layout>
  );
}