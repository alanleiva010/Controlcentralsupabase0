import React, { useMemo } from 'react';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { FinancialData } from '../../../types/financial';

interface FinancialSummaryProps {
  data: FinancialData[];
}

export function FinancialSummary({ data }: FinancialSummaryProps) {
  const summary = useMemo(() => {
    return data.reduce((acc, item) => ({
      total: acc.total + (item.type === 'income' ? item.amount : -item.amount),
      income: acc.income + (item.type === 'income' ? item.amount : 0),
      expenses: acc.expenses + (item.type === 'expense' ? item.amount : 0),
    }), {
      total: 0,
      income: 0,
      expenses: 0,
    });
  }, [data]);

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
      <SummaryCard
        title="Total Balance"
        amount={summary.total}
        icon={DollarSign}
        type="neutral"
      />
      <SummaryCard
        title="Total Income"
        amount={summary.income}
        icon={TrendingUp}
        type="positive"
      />
      <SummaryCard
        title="Total Expenses"
        amount={summary.expenses}
        icon={TrendingDown}
        type="negative"
      />
    </div>
  );
}

interface SummaryCardProps {
  title: string;
  amount: number;
  icon: React.ElementType;
  type: 'positive' | 'negative' | 'neutral';
}

function SummaryCard({ title, amount, icon: Icon, type }: SummaryCardProps) {
  const colorClass = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-blue-600',
  }[type];

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className={`h-6 w-6 ${colorClass}`} />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className={`text-2xl font-semibold ${colorClass}`}>
                ${Math.abs(amount).toFixed(2)}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}