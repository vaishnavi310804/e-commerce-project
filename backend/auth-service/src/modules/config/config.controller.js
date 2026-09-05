import {
  getAllFeatureTogglesService,
  updateFeatureToggleService,
} from "./config.service.js";

export const getFeatureToggles = async (req, res, next) => {
  try {
    const toggles = await getAllFeatureTogglesService();
    return res.status(200).json({
      success: true,
      data: toggles,
    });
  } catch (error) {
    next(error);
  }
};

export const updateFeatureToggle = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "SUPER_ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only Super Admin can enable or disable application modules.",
      });
    }

    const { key } = req.params;
    const { isEnabled, version } = req.body;

    if (isEnabled === undefined || isEnabled === null) {
      return res.status(400).json({
        success: false,
        message: "Field 'isEnabled' (boolean) is required.",
      });
    }

    const updatedToggle = await updateFeatureToggleService(
      key,
      isEnabled,
      version,
      req.user,
      {
        ipAddress: req.ip || req.headers["x-forwarded-for"] || "",
        userAgent: req.headers["user-agent"] || "",
      }
    );

    return res.status(200).json({
      success: true,
      message: `Module '${key.toUpperCase()}' ${updatedToggle.isEnabled ? "enabled" : "disabled"} successfully.`,
      data: updatedToggle,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};
