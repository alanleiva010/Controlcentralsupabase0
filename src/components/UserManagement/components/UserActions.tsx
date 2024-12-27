import React from 'react';
import { MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { UserProfile } from '../../../types/auth';

interface UserActionsProps {
  user: UserProfile;
  onEdit: (user: UserProfile) => void;
  onDelete: (userId: string) => void;
}

export function UserActions({ user, onEdit, onDelete }: UserActionsProps) {
  return (
    <div className="flex items-center justify-end space-x-2">
      <button
        onClick={() => onEdit(user)}
        className="text-gray-400 hover:text-gray-500"
        title="Edit user"
      >
        <Edit2 className="h-5 w-5" />
      </button>
      <button
        onClick={() => onDelete(user.id)}
        className="text-gray-400 hover:text-red-500"
        title="Delete user"
      >
        <Trash2 className="h-5 w-5" />
      </button>
      <button className="text-gray-400 hover:text-gray-500">
        <MoreVertical className="h-5 w-5" />
      </button>
    </div>
  );
}