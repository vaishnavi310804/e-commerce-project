import React, { useState, useEffect, useCallback } from "react";
import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
} from "../../services/roleApi";
import RoleModal from "../../components/roles/RoleModal";
import ConfirmationModel from "../../components/common/ConfirmationModel";
import RoleTable from "../../components/roles/RoleTable";
import { FaPlus } from "react-icons/fa";
import DashboardLayout from "../../layouts/DashboardLayout";
import SearchBar from "../../components/common/SearchBar";

const RoleManager = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchRoles = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getRoles();
      setRoles(res.data || []);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
      alert(error.response?.data?.message || "Failed to load roles.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const handleOpenCreateModal = () => {
    setSelectedRole(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (role) => {
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  const handleSaveRole = async (formData) => {
    try {
      setActionLoading(true);
      if (selectedRole) {
        await updateRole(selectedRole._id, formData);
        alert("Role updated successfully.");
      } else {
        await createRole(formData);
        alert("Role created successfully.");
      }
      setIsModalOpen(false);
      fetchRoles();
    } catch (error) {
      console.error("Save Role Error:", error);
      alert(error.response?.data?.message || "Failed to save role.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteRole = async () => {
    if (!roleToDelete) return;
    try {
      setActionLoading(true);
      await deleteRole(roleToDelete._id);
      alert("Role deleted successfully.");
      setRoleToDelete(null);
      fetchRoles();
    } catch (error) {
      console.error("Delete Role Error:", error);
      alert(error.response?.data?.message || "Failed to delete role.");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (role.description &&
        role.description.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Role & Access Manager
            </h1>
            <p className="mt-1 text-gray-500">
              Manage admin roles and permissions.
            </p>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 rounded-xl bg-[#6547C9] px-5 py-3 text-white transition hover:bg-indigo-700"
          >
            <FaPlus />
            Create New Role
          </button>
        </div>

        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search role by name..."
        />
        <div className="text-xs text-slate-500 font-medium">
          Total Roles: {filteredRoles.length}
        </div>

        <RoleTable
          roles={filteredRoles}
          loading={loading}
          onEdit={handleOpenEditModal}
          onDelete={(role) => setRoleToDelete(role)}
        />

        {/* Role Creation/Edit Modal */}
        <RoleModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveRole}
          role={selectedRole}
          loading={actionLoading}
        />
        <ConfirmationModel
          isOpen={!!roleToDelete}
          title="Delete Role"
          message={`Are you sure you want to delete role "${roleToDelete?.name}"?`}
          confirmText="Delete"
          onCancel={() => setRoleToDelete(null)}
          onConfirm={handleDeleteRole}
        />
      </div>
    </DashboardLayout>
  );
};

export default RoleManager;
