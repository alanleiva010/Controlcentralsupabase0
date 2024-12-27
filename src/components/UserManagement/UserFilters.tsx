import React from 'react';
import { Search } from 'lucide-react';

export function UserFilters() {
  return (
    <div className="mt-4">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="mt-3 sm:mt-0 sm:ml-4">
          <div className="flex rounded-md shadow-sm">
            <div className="relative flex-grow focus-within:z-10">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Search users..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}