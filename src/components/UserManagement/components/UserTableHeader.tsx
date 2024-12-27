import React from 'react';

export function UserTableHeader() {
  return (
    <thead className="bg-gray-50">
      <tr>
        <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Name</th>
        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Role</th>
        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
        <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
          <span className="sr-only">Actions</span>
        </th>
      </tr>
    </thead>
  );
}