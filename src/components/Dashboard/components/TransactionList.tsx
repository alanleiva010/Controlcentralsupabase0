import React from 'react';
import { FinancialData } from '../../../types/financial';
import { formatDate } from '../../../utils/date';

interface TransactionListProps {
  transactions: FinancialData[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-5">
        <h3 className="text-lg font-medium text-gray-900">Recent Transactions</h3>
        <div className="mt-4 flow-root">
          <div className="-mx-4 -my-2">
            <div className="inline-block min-w-full py-2 align-middle">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
                        {formatDate(transaction.created_at)}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {transaction.description}
                      </td>
                      <td className={`whitespace-nowrap px-4 py-4 text-sm text-right font-medium ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}