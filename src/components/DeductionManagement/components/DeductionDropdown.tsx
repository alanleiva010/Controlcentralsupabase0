import React from 'react';
import { Deduction } from '../../../types/deduction';

interface DeductionDropdownProps {
  deductions: Deduction[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  disabled?: boolean;
}

export function DeductionDropdown({ deductions, selectedIds, onChange, disabled = false }: DeductionDropdownProps) {
  return (
    <div className="space-y-2">
      {deductions.map((deduction) => (
        <label key={deduction.id} className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={selectedIds.includes(deduction.id)}
            onChange={(e) => {
              if (e.target.checked) {
                onChange([...selectedIds, deduction.id]);
              } else {
                onChange(selectedIds.filter(id => id !== deduction.id));
              }
            }}
            disabled={disabled}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-sm text-gray-700">
            {deduction.name} ({deduction.percentage}%)
          </span>
        </label>
      ))}
    </div>
  );
}