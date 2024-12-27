import React from 'react';
import { User } from './types';
import { MoreVertical } from 'lucide-react';

interface UserRowProps {
  user: User;
}

export function UserRow({ user }: UserRowProps) {
  return (
    <tr>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
        <div className="font-medium text-gray-900">{user.full_name}</div>
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.email}</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
          {user.role}
        </span>
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">Active</td>
      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
        <button className="text-gray-400 hover:text-gray-500">
          <MoreVertical className="h-5 w-5" />
        </button>
      </td>
    </tr>
  );
}