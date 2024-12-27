import React from 'react';
import { Cashbox } from '../../../types/cashbox';
import { formatDate } from '../../../utils/date';
import { formatCurrency } from '../../../utils/currency';
import { useCashboxBankBalances } from '../../../hooks/useCashboxBankBalances';
import { useTransactions } from '../../../hooks/useTransactions';

interface CashboxListProps {
  cashboxes: Cashbox[];
  onClose?: (cashbox: Cashbox) => void;
}

export function CashboxList({ cashboxes, onClose }: CashboxListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Opening ARS
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Opening USD
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Opening USDT
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Current ARS
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Current USD
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Current USDT
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {cashboxes.map((cashbox) => (
            <CashboxRow 
              key={cashbox.id} 
              cashbox={cashbox} 
              onClose={onClose}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface CashboxRowProps {
  cashbox: Cashbox;
  onClose?: (cashbox: Cashbox) => void;
}

function CashboxRow({ cashbox, onClose }: CashboxRowProps) {
  const { balances } = useCashboxBankBalances(cashbox.id);
  const { transactions } = useTransactions(cashbox.id);

  // Calculate totals from bank balances and transactions
  const totals = balances.reduce((acc, balance) => ({
    opening: {
      ARS: acc.opening.ARS + (balance.opening_balance_ars || 0),
      USD: acc.opening.USD + (balance.opening_balance_usd || 0),
      USDT: acc.opening.USDT + (balance.opening_balance_usdt || 0)
    },
    closing: {
      ARS: acc.closing.ARS + (balance.closing_balance_ars || 0),
      USD: acc.closing.USD + (balance.closing_balance_usd || 0),
      USDT: acc.closing.USDT + (balance.closing_balance_usdt || 0)
    }
  }), {
    opening: { ARS: 0, USD: 0, USDT: 0 },
    closing: { ARS: 0, USD: 0, USDT: 0 }
  });

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(cashbox.date)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
        {formatCurrency(totals.opening.ARS, 'ARS')}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
        {formatCurrency(totals.opening.USD, 'USD')}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
        {formatCurrency(totals.opening.USDT, 'USDT')}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
        {formatCurrency(totals.closing.ARS, 'ARS')}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
        {formatCurrency(totals.closing.USD, 'USD')}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
        {formatCurrency(totals.closing.USDT, 'USDT')}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          cashbox.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {cashbox.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
        {cashbox.status === 'open' && onClose && (
          <button
            onClick={() => onClose(cashbox)}
            className="text-indigo-600 hover:text-indigo-900"
          >
            Close
          </button>
        )}
      </td>
    </tr>
  );
}