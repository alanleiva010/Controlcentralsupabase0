import React from 'react';

interface RoleSelectProps {
  value: 'admin' | 'user';
  onChange: (role: 'admin' | 'user') => void;
  disabled?: boolean;
}

export function RoleSelect({ value, onChange, disabled = false }: RoleSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as 'admin' | 'user')}
      disabled={disabled}
      className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
    >
      <option value="user">User</option>
      <option value="admin">Admin</option>
    </select>
  );
}