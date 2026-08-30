import React, { useState, useEffect } from "react";
import { FaTimes, FaShieldAlt } from "react-icons/fa";

const MODULE_LIST = [
  { id: "DASHBOARD", label: "Dashboard", allowedActions: ["VIEW"] },
  { id: "CATEGORIES", label: "Categories", allowedActions: ["VIEW", "CREATE", "EDIT", "DELETE"] },
  { id: "PRODUCTS", label: "Products", allowedActions: ["VIEW", "CREATE", "EDIT", "DELETE"] },
  { id: "ORDERS", label: "Orders", allowedActions: ["VIEW", "EDIT"] },
  { id: "CUSTOMERS", label: "Customers", allowedActions: ["VIEW", "EDIT"] },
  { id: "REFUNDS", label: "Refunds", allowedActions: ["VIEW", "EDIT"] },
  { id: "SHIPMENTS", label: "Shipments", allowedActions: ["VIEW", "CREATE", "EDIT"] },
  { id: "RETURNS", label: "Returns", allowedActions: ["VIEW", "EDIT"] },
  { id: "REVIEWS", label: "Reviews", allowedActions: ["VIEW", "EDIT", "DELETE"] },
  { id: "TICKETS", label: "Tickets", allowedActions: ["VIEW", "EDIT"] },
  { id: "CUSTOMER_LOGS", label: "Customer Logs", allowedActions: ["VIEW"] },
];

const RoleModal = ({ isOpen, onClose, onSave, role, loading }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [permissionsMap, setPermissionsMap] = useState({});

  useEffect(() => {
    if (role) {
      setName(role.name || "");
      setDescription(role.description || "");
      setIsActive(role.isActive !== undefined ? role.isActive : true);

      const map = {};
      MODULE_LIST.forEach((m) => {
        map[m.id] = { VIEW: false, CREATE: false, EDIT: false, DELETE: false };
      });

      if (Array.isArray(role.permissions)) {
        role.permissions.forEach((p) => {
          const mod = String(p.module).toUpperCase();
          if (map[mod]) {
            p.actions.forEach((act) => {
              map[mod][act.toUpperCase()] = true;
            });
          }
        });
      }
      setPermissionsMap(map);
    } else {
      setName("");
      setDescription("");
      setIsActive(true);

      const map = {};
      MODULE_LIST.forEach((m) => {
        map[m.id] = { VIEW: false, CREATE: false, EDIT: false, DELETE: false };
      });
      setPermissionsMap(map);
    }
  }, [role, isOpen]);

  if (!isOpen) return null;

  const handleToggle = (moduleId, action) => {
    setPermissionsMap((prev) => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        [action]: !prev[moduleId]?.[action],
      },
    }));
  };

  const handleSelectAllModule = (moduleId, enable) => {
    const mod = MODULE_LIST.find((m) => m.id === moduleId);
    if (!mod) return;

    setPermissionsMap((prev) => {
      const updatedMod = { ...prev[moduleId] };
      mod.allowedActions.forEach((act) => {
        updatedMod[act] = enable;
      });
      return {
        ...prev,
        [moduleId]: updatedMod,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Role name is required.");
      return;
    }

    const formattedPermissions = Object.keys(permissionsMap)
      .map((modId) => {
        const activeActions = Object.keys(permissionsMap[modId]).filter(
          (act) => permissionsMap[modId][act] === true
        );
        return {
          module: modId,
          actions: activeActions,
        };
      })
      .filter((p) => p.actions.length > 0);

    onSave({
      name: name.trim(),
      description: description.trim(),
      isActive,
      permissions: formattedPermissions,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#F0EEFF] text-[#6547C9] rounded-lg">
              <FaShieldAlt className="text-xl" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                {role ? "Edit Role & Permissions" : "Create Custom Role"}
              </h2>
              <p className="text-xs text-slate-500">
                Configure module-level permissions for this admin role
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-lg hover:bg-slate-100"
          >
            <FaTimes />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Role Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. PRODUCT_MANAGER"
                required
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6547C9]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Can manage catalog products and categories"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6547C9]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 text-[#6547C9] rounded border-slate-300 focus:ring-[#6547C9]"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-slate-700 cursor-pointer">
              Active Role (Can be assigned to admins)
            </label>
          </div>

          {/* Permission Matrix Table */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-2">Module Permission Matrix</h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-100 text-slate-700 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Module</th>
                    <th className="px-4 py-3 text-center">VIEW</th>
                    <th className="px-4 py-3 text-center">CREATE</th>
                    <th className="px-4 py-3 text-center">EDIT</th>
                    <th className="px-4 py-3 text-center">DELETE</th>
                    <th className="px-4 py-3 text-center">Quick Select</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {MODULE_LIST.map((mod) => (
                    <tr key={mod.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-slate-800">{mod.label}</td>
                      {["VIEW", "CREATE", "EDIT", "DELETE"].map((action) => {
                        const isAllowed = mod.allowedActions.includes(action);
                        const isChecked = !!permissionsMap[mod.id]?.[action];

                        return (
                          <td key={action} className="px-4 py-3 text-center">
                            {isAllowed ? (
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleToggle(mod.id, action)}
                                className="w-4 h-4 text-[#6547C9] rounded border-slate-300 focus:ring-[#6547C9] cursor-pointer"
                              />
                            ) : (
                              <span className="text-slate-300 text-xs font-mono">—</span>
                            )}
                          </td>
                        );
                      })}
                      <td className="px-4 py-3 text-center space-x-2">
                        <button
                          type="button"
                          onClick={() => handleSelectAllModule(mod.id, true)}
                          className="text-[10px] font-semibold text-[#6547C9] hover:underline"
                        >
                          All
                        </button>
                        <span className="text-slate-300">|</span>
                        <button
                          type="button"
                          onClick={() => handleSelectAllModule(mod.id, false)}
                          className="text-[10px] font-semibold text-slate-500 hover:underline"
                        >
                          None
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-sm font-semibold text-white bg-[#6547C9] hover:bg-[#5237ab] rounded-lg transition-colors shadow-sm disabled:opacity-50"
            >
              {loading ? "Saving..." : role ? "Update Role" : "Create Role"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleModal;
