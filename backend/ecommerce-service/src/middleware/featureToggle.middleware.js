import mongoose from "mongoose";

export const checkAdminFeatureEnabled = (moduleKey) => {
  return async (req, res, next) => {
    try {
      if (req.user && req.user.role === "CUSTOMER") {
        return next();
      }

      const upperKey = String(moduleKey).toUpperCase();

      const toggle = await mongoose.connection
        .collection("featuretoggles")
        .findOne({ key: upperKey });

      if (toggle && toggle.isEnabled === false) {
        return res.status(503).json({
          success: false,
          code: "MODULE_DISABLED",
          message: `The ${upperKey} module is currently disabled by the Super Admin.`,
        });
      }

      next();
    } catch (error) {
      console.error(`Feature Toggle Middleware Error [${moduleKey}]:`, error);
      next();
    }
  };
};
