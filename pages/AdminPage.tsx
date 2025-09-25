
import React from 'react';
import AdminProductForm from '../components/AdminProductForm';

const AdminPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Panel</h1>
      <AdminProductForm />
    </div>
  );
};

export default AdminPage;
