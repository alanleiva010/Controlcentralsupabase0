import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, UserPlus, Settings, Building2, Percent, DollarSign, Wallet } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function Sidebar() {
  const location = useLocation();
  const { profile } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-64 bg-white shadow-sm min-h-screen">
      <nav className="mt-5 px-2">
        <Link
          to="/dashboard"
          className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
            isActive('/dashboard')
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <LayoutDashboard className="mr-3 h-6 w-6" />
          Dashboard
        </Link>

        <Link
          to="/transactions"
          className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
            isActive('/transactions')
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <DollarSign className="mr-3 h-6 w-6" />
          Transactions
        </Link>

        <Link
          to="/cashbox"
          className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
            isActive('/cashbox')
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <Wallet className="mr-3 h-6 w-6" />
          Cashbox
        </Link>

        <Link
          to="/clients"
          className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
            isActive('/clients')
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <UserPlus className="mr-3 h-6 w-6" />
          Clients
        </Link>

        <Link
          to="/operations"
          className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
            isActive('/operations')
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <Settings className="mr-3 h-6 w-6" />
          Operation Types
        </Link>

        <Link
          to="/banks"
          className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
            isActive('/banks')
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <Building2 className="mr-3 h-6 w-6" />
          Banks
        </Link>

        <Link
          to="/deductions"
          className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
            isActive('/deductions')
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <Percent className="mr-3 h-6 w-6" />
          Deductions
        </Link>

        {profile?.role === 'admin' && (
          <Link
            to="/admin/users"
            className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
              isActive('/admin/users')
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <Users className="mr-3 h-6 w-6" />
            User Management
          </Link>
        )}
      </nav>
    </div>
  );
}