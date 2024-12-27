import React, { useState } from 'react';
import { Layout } from '../Layout';
import { CashboxForm } from './components/CashboxForm';
import { CashboxList } from './components/CashboxList';
import { useCashbox } from '../../hooks/useCashbox';
import { useBanks } from '../../hooks/useBanks';
import { Cashbox } from '../../types/cashbox';
import { Wallet } from 'lucide-react';

export default function CashboxManagement() {
  const { cashboxes, loading: cashboxLoading, error: cashboxError, openCashbox, closeCashbox } = useCashbox();
  const { banks, loading: banksLoading, error: banksError } = useBanks();
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loading = cashboxLoading || banksLoading;
  const systemError = cashboxError || banksError;

  const handleOpenCashbox = async (data: any) => {
    try {
      setError(null);
      await openCashbox(data);
      setIsAdding(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to open cashbox');
    }
  };

  const handleCloseCashbox = async (cashbox: Cashbox) => {
    try {
      setError(null);
      await closeCashbox(cashbox.id, {
        ARS: cashbox.closing_balance_ars,
        USD: cashbox.closing_balance_usd,
        USDT: cashbox.closing_balance_usdt
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to close cashbox');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-6">Loading...</div>
      </Layout>
    );
  }

  if (systemError) {
    return (
      <Layout>
        <div className="p-6 text-red-600">Error: {systemError.message}</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cashbox</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage daily cashbox operations
            </p>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="mt-4 sm:mt-0 inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <Wallet className="h-4 w-4 mr-2" />
            Open New Cashbox
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {isAdding && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Open New Cashbox
            </h2>
            <CashboxForm
              banks={banks}
              onSubmit={handleOpenCashbox}
            />
          </div>
        )}

        <div className="mt-6">
          <CashboxList
            cashboxes={cashboxes}
            onClose={handleCloseCashbox}
          />
        </div>
      </div>
    </Layout>
  );
}