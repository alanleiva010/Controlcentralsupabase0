import React, { useState } from 'react';
import { CashboxFormData, CashboxBalance } from '../../../types/cashbox';
import { Bank } from '../../../types/bank';
import { BankBalanceForm } from './BankBalanceForm';
import { CURRENCIES } from '../../../utils/currency';

interface CashboxFormProps {
  onSubmit: (data: CashboxFormData) => Promise<void>;
  banks: Bank[];
  isLoading?: boolean;
}

export function CashboxForm({ onSubmit, banks, isLoading = false }: CashboxFormProps) {
  const [formData, setFormData] = useState<CashboxFormData>({
    date: new Date().toISOString().split('T')[0],
    bank_ids: [],
    bank_balances: {}
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleBankToggle = (bankId: string) => {
    setFormData(prev => {
      const newBankIds = prev.bank_ids.includes(bankId)
        ? prev.bank_ids.filter(id => id !== bankId)
        : [...prev.bank_ids, bankId];

      const newBankBalances = { ...prev.bank_balances };
      if (!newBankIds.includes(bankId)) {
        delete newBankBalances[bankId];
      } else if (!newBankBalances[bankId]) {
        newBankBalances[bankId] = {
          ARS: 0,
          USD: 0,
          USDT: 0
        };
      }

      return {
        ...prev,
        bank_ids: newBankIds,
        bank_balances: newBankBalances
      };
    });
  };

  const handleBalanceChange = (bankId: string, currency: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      bank_balances: {
        ...prev.bank_balances,
        [bankId]: {
          ...prev.bank_balances[bankId],
          [currency]: value
        }
      }
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Date *
        </label>
        <input
          type="date"
          id="date"
          required
          value={formData.date}
          onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Select Banks *
        </label>
        <div className="space-y-2">
          {banks.map((bank) => (
            <label key={bank.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.bank_ids.includes(bank.id)}
                onChange={() => handleBankToggle(bank.id)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">{bank.name}</span>
            </label>
          ))}
        </div>
      </div>

      {formData.bank_ids.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Bank Balances</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {formData.bank_ids.map(bankId => {
              const bank = banks.find(b => b.id === bankId);
              if (!bank) return null;
              
              return (
                <BankBalanceForm
                  key={bank.id}
                  bank={bank}
                  balances={formData.bank_balances[bankId] || {}}
                  onBalanceChange={handleBalanceChange}
                />
              );
            })}
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || formData.bank_ids.length === 0}
        className="w-full inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isLoading ? 'Opening...' : 'Open Cashbox'}
      </button>
    </form>
  );
}