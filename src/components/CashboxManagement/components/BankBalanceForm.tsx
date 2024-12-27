import React from 'react';
import { Bank } from '../../../types/bank';
import { CURRENCIES } from '../../../utils/currency';

interface BankBalanceFormProps {
  bank: Bank;
  onBalanceChange: (bankId: string, currency: string, value: number) => void;
  balances: { [key: string]: number };
}

export function BankBalanceForm({ bank, onBalanceChange, balances }: BankBalanceFormProps) {
  const handleChange = (currency: string, value: string) => {
    // Convert empty string to 0, otherwise parse the number
    const numericValue = value === '' ? 0 : parseFloat(value);
    onBalanceChange(bank.id, currency, numericValue);
  };

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <h3 className="font-medium text-gray-900">{bank.name}</h3>
      
      {CURRENCIES.map((currency) => (
        <div key={currency}>
          <label htmlFor={`balance_${bank.id}_${currency}`} className="block text-sm font-medium text-gray-700">
            Opening Balance ({currency})
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="number"
              id={`balance_${bank.id}_${currency}`}
              value={balances[currency] || ''}
              onChange={(e) => handleChange(currency, e.target.value)}
              min="0"
              step="any"
              placeholder="0.00"
              className="block w-full rounded-md border-gray-300 pl-3 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 sm:text-sm">{currency}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}