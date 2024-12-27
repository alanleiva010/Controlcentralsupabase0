import React from 'react';

export function TransactionList() {
  const transactions = [
    { id: 1, description: 'Deposit', amount: 1000, type: 'credit', date: '2024-03-15' },
    { id: 2, description: 'Withdrawal', amount: -500, type: 'debit', date: '2024-03-14' },
  ];

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-5">
        <h3 className="text-lg font-medium text-gray-900">Recent Transactions</h3>
        <div className="mt-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                <p className="text-sm text-gray-500">{transaction.date}</p>
              </div>
              <span
                className={`text-sm font-medium ${
                  transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {transaction.type === 'credit' ? '+' : '-'}${Math.abs(transaction.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}