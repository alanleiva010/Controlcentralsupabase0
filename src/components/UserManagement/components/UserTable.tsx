import React from 'react';
import { UserProfile } from '../../../types/auth';
import { UserTableRow } from './UserTableRow';
import { UserTableHeader } from './UserTableHeader';

interface UserTableProps {
  users: UserProfile[];
}

export function UserTable({ users }: UserTableProps) {
  return (
    <table className="min-w-full divide-y divide-gray-300">
      <UserTableHeader />
      <tbody className="divide-y divide-gray-200 bg-white">
        {users.map((user) => (
          <UserTableRow key={user.id} user={user} />
        ))}
      </tbody>
    </table>
  );
}