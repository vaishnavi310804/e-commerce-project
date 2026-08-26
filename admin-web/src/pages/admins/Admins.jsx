import React, { useEffect, useState, useCallback } from "react";
import { FaUserPlus } from "react-icons/fa";
import DashboardLayout from "../../layouts/DashboardLayout";
import SearchBar from "../../components/common/SearchBar";
import AdminTable from "../../components/admins/AdminTable";
import AdminModel from "../../components/admins/AdminModel";
import { useAuth } from "../../context/AuthContext";
import {
  getAllAdmins,
  createAdmin,
  updateAdmin,
  updateAdminStatus,
} from "../../services/authApi";

const Admins = () => {
  const { user: authUser } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const fetchAdmins = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllAdmins();
      setAdmins(data || []);
    } catch (error) {
      console.error("Failed to fetch admins:", error);
      alert("Failed to load admin list.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const filteredAdmins = admins.filter((admin) => {
    const matchesSearch =
      admin.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
        ? admin.isActive
        : !admin.isActive;

    return matchesSearch && matchesStatus;
  });

  const activeCount = admins.filter((a) => a.isActive).length;
  const inactiveCount = admins.filter((a) => !a.isActive).length;

  const handleAddAdmin = () => {
    setSelectedAdmin(null);
    setIsOpenModal(true);
  };

  const handleEditAdmin = (admin) => {
    setSelectedAdmin(admin);
    setIsOpenModal(true);
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
    setSelectedAdmin(null);
  };

  const handleCreateSubmit = async (formData) => {
    const res = await createAdmin(formData);
    alert(res.message || "Admin created successfully.");
    await fetchAdmins();
  };

  const handleUpdateSubmit = async (adminId, formData) => {
    const res = await updateAdmin(adminId, formData);
    alert(res.message || "Admin updated successfully.");
    await fetchAdmins();
  };

  const handleToggleStatus = async (admin) => {
    const newStatus = !admin.isActive;
    const actionText = newStatus ? "activate" : "deactivate";

    if (!window.confirm(`Are you sure you want to ${actionText} ${admin.fullName}?`)) {
      return;
    }

    try {
      const res = await updateAdminStatus(admin._id, newStatus);
      alert(res.message || `Admin ${newStatus ? "activated" : "deactivated"} successfully.`);
      await fetchAdmins();
    } catch (error) {
      console.error("Failed to update admin status:", error);
      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to update admin status."
      );
    }
  };

  const currentUserId = authUser?._id || authUser?.id;

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Admin Users Dashboard
            </h1>
            <p className="mt-1 text-gray-500">
              Manage system administrator accounts and access status.
            </p>
          </div>

          <button
            onClick={handleAddAdmin}
            className="flex items-center gap-2 rounded-xl bg-[#6547C9] px-5 py-3 text-white transition hover:bg-indigo-700"
          >
            <FaUserPlus /> Add Admin
          </button>
        </div>

        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search admins by name or email..."
        />

        <div className="flex gap-3">
          <button
            onClick={() => setStatusFilter("all")}
            className={`rounded-lg px-5 py-2 font-medium transition ${
              statusFilter === "all"
                ? "bg-[#6547C9] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All ({admins.length})
          </button>

          <button
            onClick={() => setStatusFilter("active")}
            className={`rounded-lg px-5 py-2 font-medium transition ${
              statusFilter === "active"
                ? "bg-[#6547C9] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Active ({activeCount})
          </button>

          <button
            onClick={() => setStatusFilter("inactive")}
            className={`rounded-lg px-5 py-2 font-medium transition ${
              statusFilter === "inactive"
                ? "bg-[#6547C9] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Inactive ({inactiveCount})
          </button>
        </div>

        <AdminTable
          admins={filteredAdmins}
          loading={loading}
          onEdit={handleEditAdmin}
          onToggleStatus={handleToggleStatus}
          currentUserId={currentUserId}
        />

        <AdminModel
          open={isOpenModal}
          onClose={handleCloseModal}
          admin={selectedAdmin}
          onCreate={handleCreateSubmit}
          onUpdate={handleUpdateSubmit}
          onSuccess={fetchAdmins}
        />
      </div>
    </DashboardLayout>
  );
};

export default Admins;
