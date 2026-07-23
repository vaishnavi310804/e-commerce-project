import React from "react";
import {
  FaUsers,
  FaUserCheck,
  FaUserSlash,
  FaUserPlus,
  FaShoppingBag,
  FaDollarSign,
} from "react-icons/fa";

const CustomerStatsCards = ({ stats }) => {
  const {
    totalCustomers = 0,
    activeCustomers = 0,
    blockedCustomers = 0,
    newCustomersThisMonth = 0,
    totalOrders = 0,
    totalRevenue = 0,
  } = stats || {};

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
      <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow border-l-4 border-indigo-500">
        <div className="rounded-lg bg-indigo-50 p-3 text-indigo-600">
          <FaUsers size={20} />
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500">Total Customers</p>
          <h3 className="text-xl font-bold text-gray-800">{totalCustomers}</h3>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow border-l-4 border-emerald-500">
        <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600">
          <FaUserCheck size={20} />
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500">Active</p>
          <h3 className="text-xl font-bold text-gray-800">{activeCustomers}</h3>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow border-l-4 border-rose-500">
        <div className="rounded-lg bg-rose-50 p-3 text-rose-600">
          <FaUserSlash size={20} />
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500">Blocked</p>
          <h3 className="text-xl font-bold text-gray-800">{blockedCustomers}</h3>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow border-l-4 border-amber-500">
        <div className="rounded-lg bg-amber-50 p-3 text-amber-600">
          <FaUserPlus size={20} />
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500">New This Month</p>
          <h3 className="text-xl font-bold text-gray-800">{newCustomersThisMonth}</h3>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow border-l-4 border-sky-500">
        <div className="rounded-lg bg-sky-50 p-3 text-sky-600">
          <FaShoppingBag size={20} />
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500">Total Orders</p>
          <h3 className="text-xl font-bold text-gray-800">{totalOrders}</h3>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow border-l-4 border-purple-500">
        <div className="rounded-lg bg-purple-50 p-3 text-purple-600">
          <FaDollarSign size={20} />
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500">Total Revenue</p>
          <h3 className="text-xl font-bold text-gray-800">
            ${totalRevenue.toFixed(2)}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default CustomerStatsCards;
