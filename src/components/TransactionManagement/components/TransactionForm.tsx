import React, { useState, useEffect } from 'react';
import { TransactionFormData } from '../../../types/transaction';
import { Client } from '../../../types/client';
import { Bank } from '../../../types/bank';
import { Deduction } from '../../../types/deduction';
import { DeductionDropdown } from '../../DeductionManagement/components/DeductionDropdown';
import { calculateNetAmount, calculateCryptoAmount } from '../../../utils/transaction';

const OPERATION_TYPES = [
  { value: 'ars_in', label: 'ARS Entry' },
  { value: 'ars_out', label: 'ARS Exit' },
  { value: 'usdt_buy', label: 'USDT Purchase' },
  { value: 'usdt_sell', label: 'USDT Sale' },
  { value: 'usdt_in', label: 'USDT Entry' },
  { value: 'usdt_out', label: 'USDT Exit' },
  { value: 'usd_buy', label: 'USD Purchase' },
  { value: 'usd_sell', label: 'USD Sale' },
  { value: 'usd_in', label: 'USD Entry' },
  { value: 'usd_out', label: 'USD Exit' }
];

interface TransactionFormProps {
  onSubmit: (data: TransactionFormData) => Promise<void>;
  clients: Client[];
  banks: Bank[];
  deductions: Deduction[];
  isLoading?: boolean;
}

export function TransactionForm({ onSubmit, clients, banks, deductions, isLoading = false }: TransactionFormProps) {
  const [formData, setFormData] = useState<TransactionFormData>({
    client_id: '',
    bank_id: '',
    operation_type: '',
    amount: 0,
    currency: 'ARS',
    deduction_ids: []
  });

  const [cryptoAmount, setCryptoAmount] = useState<number>(0);
  const [netAmount, setNetAmount] = useState<number>(0);

  useEffect(() => {
    const selectedDeductions = deductions.filter(d => formData.deduction_ids?.includes(d.id));
    
    if (formData.operation_type === 'usdt_buy' || formData.operation_type === 'usd_buy') {
      const net = calculateNetAmount(formData.amount, selectedDeductions);
      setNetAmount(net);
      if (formData.exchange_rate > 0) {
        setCryptoAmount(calculateCryptoAmount(net, formData.exchange_rate));
      }
    } else if (formData.operation_type === 'usdt_sell' || formData.operation_type === 'usd_sell') {
      if (formData.exchange_rate > 0) {
        const arsAmount = formData.amount * formData.exchange_rate;
        setNetAmount(calculateNetAmount(arsAmount, selectedDeductions));
        setCryptoAmount(formData.amount);
      }
    } else if (formData.operation_type === 'ars_in' || formData.operation_type === 'ars_out') {
      // Calculate net amount for ARS operations with deductions
      setNetAmount(calculateNetAmount(formData.amount, selectedDeductions));
      setCryptoAmount(0);
    } else {
      setNetAmount(formData.amount);
      setCryptoAmount(0);
    }
  }, [formData.amount, formData.deduction_ids, formData.exchange_rate, formData.operation_type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      ...formData,
      crypto_amount: cryptoAmount || undefined,
      net_amount: netAmount
    });
  };

  const isCryptoOperation = formData.operation_type?.includes('usdt') || formData.operation_type?.includes('usd');
  const isCryptoPurchase = formData.operation_type === 'usdt_buy' || formData.operation_type === 'usd_buy';
  const isCryptoSale = formData.operation_type === 'usdt_sell' || formData.operation_type === 'usd_sell';
  const showDeductions = !formData.operation_type?.includes('in') && !formData.operation_type?.includes('out') || 
                        formData.operation_type === 'ars_in' || formData.operation_type === 'ars_out';
  const showExchangeRate = isCryptoPurchase || isCryptoSale;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="client" className="block text-sm font-medium text-gray-700">
            Client *
          </label>
          <select
            id="client"
            required
            value={formData.client_id}
            onChange={(e) => setFormData(prev => ({ ...prev, client_id: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select a client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
        </div>

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
          <label htmlFor="operation_type" className="block text-sm font-medium text-gray-700">
            Operation Type *
          </label>
          <select
            id="operation_type"
            required
            value={formData.operation_type}
            onChange={(e) => setFormData(prev => ({ ...prev, operation_type: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select operation type</option>
            {OPERATION_TYPES.map((type) => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            {isCryptoSale ? 'Crypto Amount' : 'Amount'} *
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="number"
              id="amount"
              required
              min="0"
              step="0.01"
              value={formData.amount || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        {showExchangeRate && (
          <div>
            <label htmlFor="exchange_rate" className="block text-sm font-medium text-gray-700">
              Exchange Rate *
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="number"
                id="exchange_rate"
                required
                min="0"
                step="0.01"
                value={formData.exchange_rate || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, exchange_rate: parseFloat(e.target.value) || 0 }))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        )}

        {showDeductions && (
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deductions
            </label>
            <DeductionDropdown
              deductions={deductions}
              selectedIds={formData.deduction_ids || []}
              onChange={(ids) => setFormData(prev => ({ ...prev, deduction_ids: ids }))}
            />
          </div>
        )}

        <div className="sm:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
        <div className="mb-4 text-sm text-gray-600">
          {netAmount > 0 && <div>Net Amount: ${netAmount.toFixed(2)}</div>}
          {cryptoAmount > 0 && <div>Crypto Amount: {cryptoAmount.toFixed(8)}</div>}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {isLoading ? 'Processing...' : 'Create Transaction'}
        </button>
      </div>
    </form>
  );
}