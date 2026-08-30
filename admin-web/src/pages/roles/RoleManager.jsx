import React, { useState, useEffect, useCallback } from "react";
import { getRoles, createRole, updateRole, deleteRole } from "../../services/roleApi";
import RoleModal from "../../components/roles/RoleModal";
import ConfirmationModel from "../../components/common/ConfirmationModel";
import { FaShieldAlt, FaPlus, FaEdit, FaTrash, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

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

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (role.description && role.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#F0EEFF] text-[#6547C9] rounded-xl">
              <FaShieldAlt className="text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Role & Access Manager</h1>
              <p className="text-sm text-slate-500">
                Configure dynamic admin roles and module-level permissions
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#6547C9] hover:bg-[#5237ab] text-white font-semibold text-sm rounded-xl transition-all shadow-sm"
        >
          <FaPlus />
          Create New Role
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search roles by name or description..."
          className="w-full md:w-80 px-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6547C9]"
        />
        <div className="text-xs text-slate-500 font-medium">
          Total Roles: {filteredRoles.length}
        </div>
      </div>

      {/* Roles Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-slate-500 text-sm">Loading roles...</div>
        ) : filteredRoles.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-sm">No roles found.</div>
        ) : (
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-xs border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Role Name</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-center">Permitted Modules</th>
                <th className="px-6 py-4 text-center">Assigned Admins</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredRoles.map((role) => (
                <tr key={role._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">{role.name}</span>
                      {role.isSystemRole && (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded-md">
                          System Role
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs max-w-xs truncate">
                    {role.description || "No description"}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-2.5 py-1 text-xs font-semibold bg-indigo-50 text-indigo-700 rounded-full">
                      {role.permissions?.length || 0} Modules
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center font-semibold text-slate-700">
                    {role.assignedAdminsCount !== undefined ? role.assignedAdminsCount : 0}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {role.isActive ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 rounded-full">
                        <FaCheckCircle className="text-xs" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-rose-50 text-rose-700 rounded-full">
                        <FaTimesCircle className="text-xs" /> Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEditModal(role)}
                      className="p-2 text-slate-600 hover:text-[#6547C9] hover:bg-[#F0EEFF] rounded-lg transition-colors"
                      title="Edit Permissions"
                    >
                      <FaEdit />
                    </button>
                    {!role.isSystemRole && (
                      <button
                        onClick={() => setRoleToDelete(role)}
                        className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Role"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Role Creation/Edit Modal */}
      <RoleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveRole}
        role={selectedRole}
        loading={actionLoading}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModel
        isOpen={!!roleToDelete}
        title="Delete Role"
        message={`Are you sure you want to delete role "${roleToDelete?.name}"?`}
        onCancel={() => setRoleToDelete(null)}
        onConfirm={handleDeleteRole}
      />
    </div>
  );
};

export default RoleManager;
