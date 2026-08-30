import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { getRoles } from "../../services/roleApi";

const AdminModel = ({ open, onClose, admin, onSuccess, onCreate, onUpdate }) => {
  const isEdit = Boolean(admin);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    roleId: "",
  });

  const [roles, setRoles] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const res = await getRoles();
        const activeRoles = (res.data || []).filter((r) => r.isActive);
        setRoles(activeRoles);
      } catch (err) {
        console.error("Failed to load roles in AdminModel:", err);
      }
    };
    if (open) {
      loadRoles();
    }
  }, [open]);

  useEffect(() => {
    if (admin) {
      setFormData({
        fullName: admin.fullName || "",
        email: admin.email || "",
        password: "",
        roleId: admin.roleId?._id || admin.roleId || "",
      });
    } else {
      setFormData({
        fullName: "",
        email: "",
        password: "",
        roleId: "",
      });
    }
    setErrors({});
  }, [admin, open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!isEdit) {
      if (!formData.password) {
        newErrors.password = "Password is required.";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitting(true);

      if (isEdit) {
        await onUpdate(admin._id, {
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          roleId: formData.roleId || null,
        });
      } else {
        await onCreate({
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          password: formData.password,
          roleId: formData.roleId || null,
        });
      }

      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      console.error("Admin Form Submit Error:", err);
      const apiMsg = err.response?.data?.message || err.message || "Failed to save admin.";
      setErrors((prev) => ({ ...prev, server: apiMsg }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-xl font-bold text-gray-800">
            {isEdit ? "Edit Admin User" : "Add New Admin"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <FaTimes size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.server && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {errors.server}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Name"
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-[#6547C9] focus:outline-none focus:ring-1 focus:ring-[#6547C9]"
            />
            {errors.fullName && (
              <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@example.com"
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-[#6547C9] focus:outline-none focus:ring-1 focus:ring-[#6547C9]"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          {!isEdit && (
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 8 characters"
                className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-[#6547C9] focus:outline-none focus:ring-1 focus:ring-[#6547C9]"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Assigned Custom Role
            </label>
            <select
              name="roleId"
              value={formData.roleId}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-[#6547C9] focus:outline-none focus:ring-1 focus:ring-[#6547C9] bg-white"
            >
              <option value="">Full Admin</option>
              {roles.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.name} {r.isSystemRole ? "(System Role)" : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-[#6547C9] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
            >
              {submitting
                ? "Saving..."
                : isEdit
                ? "Save Changes"
                : "Create Admin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminModel;
