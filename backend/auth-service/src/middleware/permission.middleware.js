import Role from "../modules/roles/role.model.js";

export const authorizePermission = (moduleName, actionName) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required.",
        });
      }

      // SUPER_ADMIN string role bypasses permission checks
      if (req.user.role === "SUPER_ADMIN") {
        return next();
      }

      if (!req.user.isActive) {
        return res.status(403).json({
          success: false,
          message: "Your account has been deactivated.",
        });
      }

      let roleDoc = req.user.roleId;

      if (roleDoc && typeof roleDoc === "object" && roleDoc.permissions) {
        // already populated
      } else if (roleDoc) {
        roleDoc = await Role.findById(roleDoc);
      } else {
        // Default unassigned ADMIN to FULL_ADMIN system role
        roleDoc = await Role.findOne({ name: "FULL_ADMIN", isActive: true });
      }

      if (!roleDoc || !roleDoc.isActive) {
        return res.status(403).json({
          success: false,
          message: "Access denied. Your assigned role is inactive or unassigned.",
        });
      }

      const reqModule = String(moduleName).toUpperCase();
      const reqAction = String(actionName).toUpperCase();

      const modulePerm = roleDoc.permissions.find(
        (p) => String(p.module).toUpperCase() === reqModule
      );

      if (modulePerm && modulePerm.actions && modulePerm.actions.includes(reqAction)) {
        return next();
      }

      return res.status(403).json({
        success: false,
        message: `Access denied. You do not have permission to ${reqAction} ${reqModule}.`,
      });
    } catch (error) {
      console.error("Permission Middleware Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error during permission check.",
      });
    }
  };
};
