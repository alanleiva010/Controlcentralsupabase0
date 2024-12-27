import React from 'react';
import { BankFormData } from '../../../types/bank';

interface BankFormProps {
  onSubmit: (data: BankFormData) => Promise<void>;
  initialData?: BankFormData;
  isLoading?: boolean;
}

export function BankForm({ onSubmit, initialData, isLoading = false }: BankFormProps) {
  const [formData, setFormData] = React.useState<BankFormData>(initialData ?? {
    name: '',
    country: '',
    swift_code: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Bank Name *
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="country" className="block text-sm font-medium text-gray-700">
          Country
        </label>
        <input
          type="text"
          id="country"
          value={formData.country}
          onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="swift_code" className="block text-sm font-medium text-gray-700">
          SWIFT Code
        </label>
        <input
          type="text"
          id="swift_code"
          value={formData.swift_code}
          onChange={(e) => setFormData(prev => ({ ...prev, swift_code: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="e.g., BOFAUS3N"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isLoading ? 'Saving...' : 'Save Bank'}
      </button>
    </form>
  );
}