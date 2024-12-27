import { useState } from 'react';
import { UserProfile } from '../types/auth';
import { supabase } from '../lib/supabase';

export function useUserManagement() {
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);

  const updateUserRole = async (userId: string, role: 'admin' | 'user') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating user role:', error);
      return false;
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  };

  return {
    editingUser,
    setEditingUser,
    updateUserRole,
    deleteUser,
  };
}