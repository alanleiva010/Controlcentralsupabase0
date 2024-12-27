import React from 'react';
import { Layout } from '../Layout';
import { FinancialSummary } from './components/FinancialSummary';
import { TransactionList } from './components/TransactionList';
import { useFinancialData } from '../../hooks/useFinancialData';
import { useAuth } from '../../contexts/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const { data: transactions, loading, error } = useFinancialData(user?.id);

  if (loading) {
    return (
      <Layout>
        <div className="p-6">Loading financial data...</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="p-6 text-red-600">Error: {error.message}</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Financial Dashboard
        </h1>
        <FinancialSummary data={transactions} />
        <div className="mt-8">
          <TransactionList transactions={transactions} />
        </div>
      </div>
    </Layout>
  );
}