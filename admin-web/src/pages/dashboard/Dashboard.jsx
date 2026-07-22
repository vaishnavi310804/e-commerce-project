import React from 'react'
import DashboardLayout from '../../layouts/DashboardLayout';

const Dashboard = () => {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold">
        Welcome to ShopEase Admin
      </h1>

      <p className="mt-3 text-slate-500">
        Manage your products, orders and customers from here.
      </p>
    </DashboardLayout>
  );
}

export default Dashboard;
