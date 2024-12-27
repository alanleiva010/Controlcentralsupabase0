import React from 'react';
import { DeductionFormData } from '../../../types/deduction';

interface DeductionFormProps {
  onSubmit: (data: DeductionFormData) => Promise<void>;
  initialData?: DeductionFormData;
  isLoading?: boolean;
}

export function DeductionForm({ onSubmit, initialData, isLoading = false }: DeductionFormProps) {
  const [formData, setFormData] = React.useState<DeductionFormData>(initialData ?? {
    name: '',
    percentage: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Deduction Name *
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
        <label htmlFor="percentage" className="block text-sm font-medium text-gray-700">
          Percentage *
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <input
            type="number"
            id="percentage"
            required
            min="0"
            max="100"
            step="0.01"
            value={formData.percentage}
            onChange={(e) => setFormData(prev => ({ ...prev, percentage: parseFloat(e.target.value) }))}
            className="block w-full rounded-md border-gray-300 pl-3 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="text-gray-500 sm:text-sm">%</span>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isLoading ? 'Saving...' : 'Save Deduction'}
      </button>
    </form>
  );
}