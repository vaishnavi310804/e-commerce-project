import React from "react";
import { FaSyncAlt, FaFilePdf, FaFileExcel } from "react-icons/fa";

const DashboardHeader = ({
  lastUpdated,
  loading,
  onExportPDF,
  onExportExcel,
}) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Analytics</h1>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={onExportPDF}
          className="flex items-center gap-2 rounded-lg bg-rose-600 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-rose-700"
        >
          <FaFilePdf /> Export PDF
        </button>

        <button
          onClick={onExportExcel}
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
        >
          <FaFileExcel /> Export Excel
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;
