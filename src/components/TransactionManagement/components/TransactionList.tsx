import React from 'react';
import { Transaction } from '../../../types/transaction';
import { formatCurrency } from '../../../utils/currency';
import { formatDate } from '../../../utils/date';

interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  const getOperationDetails = (transaction: Transaction) => {
    switch (transaction.operation_type) {
      case 'usdt_buy':
        return {
          amount: `${formatCurrency(transaction.amount, 'ARS')} → ${formatCurrency(transaction.crypto_amount || 0, 'USDT')}`,
          rate: transaction.exchange_rate ? `Rate: ${formatCurrency(transaction.exchange_rate, 'ARS')}` : null
        };
      case 'usdt_sell':
        return {
          amount: `${formatCurrency(transaction.crypto_amount || 0, 'USDT')} → ${formatCurrency(transaction.amount, 'ARS')}`,
          rate: transaction.exchange_rate ? `Rate: ${formatCurrency(transaction.exchange_rate, 'ARS')}` : null
        };
      case 'usd_buy':
        return {
          amount: `${formatCurrency(transaction.amount, 'ARS')} → ${formatCurrency(transaction.crypto_amount || 0, 'USD')}`,
          rate: transaction.exchange_rate ? `Rate: ${formatCurrency(transaction.exchange_rate, 'ARS')}` : null
        };
      case 'usd_sell':
        return {
          amount: `${formatCurrency(transaction.crypto_amount || 0, 'USD')} → ${formatCurrency(transaction.amount, 'ARS')}`,
          rate: transaction.exchange_rate ? `Rate: ${formatCurrency(transaction.exchange_rate, 'ARS')}` : null
        };
      default:
        return {
          amount: formatCurrency(transaction.amount, transaction.currency),
          rate: null
        };
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Client
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Bank
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Operation
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Net Amount
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((transaction) => {
            const { amount, rate } = getOperationDetails(transaction);
            return (
              <tr key={transaction.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(transaction.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {transaction.client?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {transaction.bank?.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div>{transaction.operation_type}</div>
                  {rate && <div className="text-xs text-gray-500">{rate}</div>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                  {amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                  {formatCurrency(transaction.net_amount, transaction.currency)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}