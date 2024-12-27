import React from 'react';
import { SearchInput } from './SearchInput';

interface UserFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function UserFilters({ searchTerm, onSearchChange }: UserFiltersProps) {
  return (
    <div className="mt-4">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="mt-3 sm:mt-0 sm:ml-4">
          <div className="flex rounded-md shadow-sm w-72">
            <SearchInput
              value={searchTerm}
              onChange={onSearchChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}