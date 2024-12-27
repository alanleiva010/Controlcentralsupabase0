import React from 'react';
import { Layout } from '../Layout';
import { UserTable } from './components/UserTable';
import { UserFilters } from './components/UserFilters';
import { useUsers } from '../../hooks/useUsers';
import { useUserSearch } from '../../hooks/useUserSearch';

export default function UserManagement() {
  const { users, loading, error } = useUsers();
  const { searchTerm, setSearchTerm, filteredUsers } = useUserSearch(users);

  if (loading) {
    return (
      <Layout>
        <div className="p-6">Loading users...</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="p-6 text-red-600">Error: {error.message}</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage user accounts and permissions
            </p>
          </div>
        </div>
        <UserFilters 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        <div className="mt-8 flex flex-col">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <UserTable users={filteredUsers} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}