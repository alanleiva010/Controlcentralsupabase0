import React from 'react';
import { DollarSign } from 'lucide-react';

export function BalanceCard() {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <DollarSign className="h-6 w-6 text-gray-400" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                Current Balance
              </dt>
              <dd className="text-3xl font-semibold text-gray-900">
                $50,000.00
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}