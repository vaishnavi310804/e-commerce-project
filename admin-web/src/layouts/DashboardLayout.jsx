import React from "react";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#F8F7FF]">
      <Sidebar />

      <div className="min-h-screen lg:ml-65">
        <Navbar />

        <main className="min-w-0 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;