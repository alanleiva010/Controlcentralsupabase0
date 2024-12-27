import React from 'react';
import { UserProfile } from '../../../types/auth';
import { UserActions } from './UserActions';
import { RoleSelect } from './RoleSelect';

interface UserTableRowProps {
  user: UserProfile;
  onEdit: (user: UserProfile) => void;
  onDelete: (userId: string) => void;
  onRoleChange: (userId: string, role: 'admin' | 'user') => void;
}

export function UserTableRow({ user, onEdit, onDelete, onRoleChange }: UserTableRowProps) {
  return (
    <tr>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
        <div className="font-medium text-gray-900">{user.full_name}</div>
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.email}</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        <RoleSelect
          value={user.role}
          onChange={(role) => onRoleChange(user.id, role)}
        />
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">Active</td>
      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
        <UserActions
          user={user}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </td>
    </tr>
  );
}