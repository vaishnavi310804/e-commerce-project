import React from "react";
import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle, FaHome } from "react-icons/fa";
import DashboardLayout from "../../layouts/DashboardLayout";

const MODULE_NAMES = {
  PRODUCTS: "Products",
  CATEGORIES: "Categories",
  ORDERS: "Orders",
  REVIEWS: "Reviews",
  TICKETS: "Tickets",
  RETURNS: "Returns & Exchanges",
  SHIPMENTS: "Shipments",
  REFUNDS: "Refunds",
  CUSTOMER_LOGS: "Customer Logs",
  CUSTOMERS: "Customers",
};

const ModuleDisabled = ({ moduleKey = "" }) => {
  const navigate = useNavigate();
  const displayName = MODULE_NAMES[moduleKey?.toUpperCase()] || moduleKey || "This module";

  return (
    <DashboardLayout>
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center p-6 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-50 text-amber-600 shadow-sm border border-amber-200">
        <FaExclamationTriangle size={36} />
      </div>

      <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-800">
        Module Disabled
      </h2>

      <p className="mt-2 max-w-md text-sm text-slate-600 leading-relaxed">
        <span className="font-semibold text-slate-800">{displayName}</span> is currently disabled by the Super Admin.
      </p>

      <p className="mt-1 text-xs text-slate-400">
        Please contact your Super Admin if you require access to this module.
      </p>

      {/* <button
        type="button"
        onClick={() => navigate("/dashboard")}
        className="mt-8 flex items-center gap-2 rounded-xl bg-[#6547C9] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#5237ab] focus:outline-none focus:ring-2 focus:ring-[#6547C9] focus:ring-offset-2"
      >
        <FaHome />
        <span>Go to Dashboard</span>
      </button> */}
    </div>
    </DashboardLayout>
  );
};

export default ModuleDisabled;
