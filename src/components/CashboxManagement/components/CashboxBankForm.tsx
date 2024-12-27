import React, { useState } from 'react';
import { CashboxBankFormData } from '../../../types/cashboxBank';
import { Bank } from '../../../types/bank';

interface CashboxBankFormProps {
  onSubmit: (data: CashboxBankFormData) => Promise<void>;
  banks: Bank[];
  isLoading?: boolean;
}

export function CashboxBankForm({ onSubmit, banks, isLoading = false }: CashboxBankFormProps) {
  const [formData, setFormData] = useState<CashboxBankFormData>({
    bank_id: '',
    opening_balance: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="bank" className="block text-sm font-medium text-gray-700">
          Bank *
        </label>
        <select
          id="bank"
          required
          value={formData.bank_id}
          onChange={(e) => setFormData(prev => ({ ...prev, bank_id: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Select a bank</option>
          {banks.map((bank) => (
            <option key={bank.id} value={bank.id}>{bank.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="opening_balance" className="block text-sm font-medium text-gray-700">
          Opening Balance *
        </label>
        <input
          type="number"
          id="opening_balance"
          required
          min="0"
          step="0.01"
          value={formData.opening_balance}
          onChange={(e) => setFormData(prev => ({ ...prev, opening_balance: parseFloat(e.target.value) }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isLoading ? 'Adding...' : 'Add Bank'}
      </button>
    </form>
  );
}