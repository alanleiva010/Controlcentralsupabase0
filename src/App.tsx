import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LoginForm from './components/LoginForm';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './components/Dashboard';
import UserManagement from './components/UserManagement';
import ClientManagement from './components/ClientManagement';
import OperationTypesManagement from './components/OperationTypes';
import BankManagement from './components/BankManagement';
import DeductionManagement from './components/DeductionManagement';
import TransactionManagement from './components/TransactionManagement';
import CashboxManagement from './components/CashboxManagement';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/clients" element={
            <ProtectedRoute>
              <ClientManagement />
            </ProtectedRoute>
          } />
          <Route path="/operations" element={
            <ProtectedRoute>
              <OperationTypesManagement />
            </ProtectedRoute>
          } />
          <Route path="/banks" element={
            <ProtectedRoute>
              <BankManagement />
            </ProtectedRoute>
          } />
          <Route path="/deductions" element={
            <ProtectedRoute>
              <DeductionManagement />
            </ProtectedRoute>
          } />
          <Route path="/transactions" element={
            <ProtectedRoute>
              <TransactionManagement />
            </ProtectedRoute>
          } />
          <Route path="/cashbox" element={
            <ProtectedRoute>
              <CashboxManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute adminOnly>
              <UserManagement />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;