import React, { useState } from 'react';
import { Layout } from '../Layout';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { useTransactions } from '../../hooks/useTransactions';
import { useClients } from '../../hooks/useClients';
import { useBanks } from '../../hooks/useBanks';
import { useDeductions } from '../../hooks/useDeductions';
import { useCashbox } from '../../hooks/useCashbox';
import { DollarSign } from 'lucide-react';

export default function TransactionManagement() {
  const { cashboxes, refresh: refreshCashbox } = useCashbox();
  const { transactions, loading: transactionsLoading, error: transactionsError, addTransaction } = useTransactions(
    cashboxes.find(c => c.status === 'open')?.id,
    refreshCashbox // Pass the refresh function to update cashbox after transaction
  );
  const { clients, loading: clientsLoading } = useClients();
  const { banks, loading: banksLoading } = useBanks();
  const { deductions, loading: deductionsLoading } = useDeductions();
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loading = transactionsLoading || clientsLoading || banksLoading || deductionsLoading;

  const handleSubmit = async (data: any) => {
    try {
      setError(null);
      const openCashbox = cashboxes.find(c => c.status === 'open');
      if (!openCashbox) {
        throw new Error('No open cashbox found');
      }
      await addTransaction({
        ...data,
        cashbox_id: openCashbox.id
      });
      setIsAdding(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create transaction');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-6">Loading...</div>
      </Layout>
    );
  }

  if (transactionsError) {
    return (
      <Layout>
        <div className="p-6 text-red-600">Error: {transactionsError.message}</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage your transactions
            </p>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            disabled={!cashboxes.some(c => c.status === 'open')}
            className="mt-4 sm:mt-0 inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            <DollarSign className="h-4 w-4 mr-2" />
            New Transaction
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {!cashboxes.some(c => c.status === 'open') && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-600">
              You need to open a cashbox before creating transactions
            </p>
          </div>
        )}

        {isAdding && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              New Transaction
            </h2>
            <TransactionForm
              onSubmit={handleSubmit}
              clients={clients}
              banks={banks}
              deductions={deductions}
            />
          </div>
        )}

        <div className="mt-6">
          <TransactionList transactions={transactions} />
        </div>
      </div>
    </Layout>
  );
}