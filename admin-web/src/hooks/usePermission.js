import { useAuth } from "../context/AuthContext";

export const usePermission = () => {
  const { user } = useAuth();

  const hasPermission = (moduleName, actionName = "VIEW") => {
    if (!user) return false;

    // SUPER_ADMIN string role bypasses all checks
    if (user.role === "SUPER_ADMIN") {
      return true;
    }

    const reqModule = String(moduleName).toUpperCase();
    const reqAction = String(actionName).toUpperCase();

    // Check custom assigned role permissions
    const permissions = user?.roleId?.permissions;
    if (Array.isArray(permissions)) {
      const modulePerm = permissions.find(
        (p) => String(p.module).toUpperCase() === reqModule
      );
      return modulePerm?.actions?.includes(reqAction) || false;
    }

    // Default fallback for legacy ADMIN accounts before explicit role assignment
    const standardModules = [
      "DASHBOARD",
      "CATEGORIES",
      "PRODUCTS",
      "ORDERS",
      "CUSTOMERS",
      "REFUNDS",
      "SHIPMENTS",
      "RETURNS",
      "REVIEWS",
      "TICKETS",
      "CUSTOMER_LOGS",
    ];

    if (user.role === "ADMIN" && standardModules.includes(reqModule)) {
      return true;
    }

    return false;
  };

  return { hasPermission, isSuperAdmin: user?.role === "SUPER_ADMIN" };
};
