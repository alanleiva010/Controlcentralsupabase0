import { useState, useMemo } from 'react';
import { UserProfile } from '../types/auth';

export function useUserSearch(users: UserProfile[]) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    
    const lowerSearch = searchTerm.toLowerCase();
    return users.filter(user => 
      user.email.toLowerCase().includes(lowerSearch) ||
      (user.full_name?.toLowerCase() || '').includes(lowerSearch)
    );
  }, [users, searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    filteredUsers
  };
}