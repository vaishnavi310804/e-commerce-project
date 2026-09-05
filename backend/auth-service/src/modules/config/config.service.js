import FeatureToggle from "./featureToggle.model.js";
import { createAuditLog } from "../audit/auditLog.service.js";

const DEFAULT_FEATURE_TOGGLES = [
  { key: "PRODUCTS", name: "Products Management", description: "Controls Product and product listing in Admin Dashboard." },
  { key: "CATEGORIES", name: "Category Management", description: "Controls product category in Admin Dashboard." },
  { key: "ORDERS", name: "Order Processing", description: "Controls order management and processing in Admin Dashboard." },
  { key: "REVIEWS", name: "Review", description: "Controls Customer product review in Admin Dashboard." },
  { key: "TICKETS", name: "Support Tickets", description: "Controls support ticket management in Admin Dashboard." },
  { key: "RETURNS", name: "Returns & Exchanges", description: "Controls customer return/exchange management in Admin Dashboard." },
  { key: "SHIPMENTS", name: "Shipment Tracking", description: "Controls shipment dispatch and tracking in Admin Dashboard." },
  { key: "REFUNDS", name: "Refund Processing", description: "Controls customer refund processing in Admin Dashboard." },
  { key: "CUSTOMER_LOGS", name: "Customer Audit Logs", description: "Controls customer action audit logs viewing in Admin Dashboard." },
  { key: "CUSTOMERS", name: "Customer Management", description: "Controls customer account management in Admin Dashboard." },
];

export const seedDefaultFeatureToggles = async () => {
  try {
    for (const toggle of DEFAULT_FEATURE_TOGGLES) {
      const existing = await FeatureToggle.findOne({ key: toggle.key });
      if (!existing) {
        await FeatureToggle.create({
          key: toggle.key,
          name: toggle.name,
          description: toggle.description,
          isEnabled: true,
          version: 1,
        });
      }
    }
  } catch (error) {
    console.error("Error seeding default feature toggles:", error);
  }
};

export const getAllFeatureTogglesService = async () => {
  return await FeatureToggle.find()
    .populate("updatedBy", "fullName email")
    .sort({ key: 1 });
};

export const updateFeatureToggleService = async (key, isEnabled, submittedVersion, user, reqMetadata = {}) => {
  const upperKey = String(key).toUpperCase();
  const toggle = await FeatureToggle.findOne({ key: upperKey });

  if (!toggle) {
    const error = new Error(`Feature toggle key '${upperKey}' not found.`);
    error.statusCode = 404;
    throw error;
  }

  if (submittedVersion !== undefined && submittedVersion !== null) {
    const numericVersion = Number(submittedVersion);
    if (!isNaN(numericVersion) && toggle.version !== numericVersion) {
      const error = new Error("Conflict: Feature toggle state was modified by another administrator. Please refresh.");
      error.statusCode = 409;
      throw error;
    }
  }

  const previousState = toggle.isEnabled;
  const previousVersion = toggle.version;

  toggle.isEnabled = Boolean(isEnabled);
  toggle.version = (toggle.version || 1) + 1;
  toggle.updatedBy = user._id;

  await toggle.save();

  try {
    await createAuditLog({
      actorId: user._id,
      actorRole: "SUPER_ADMIN",
      module: "SYSTEM_CONFIG",
      action: "FEATURE_TOGGLE_UPDATED",
      targetId: null,
      targetType: "SYSTEM_SETTING",
      description: `Super Admin ${user.fullName || user.email} ${toggle.isEnabled ? "enabled" : "disabled"} module [${upperKey}]`,
      changes: {
        before: { isEnabled: previousState, version: previousVersion },
        after: { isEnabled: toggle.isEnabled, version: toggle.version },
      },
      ipAddress: reqMetadata.ipAddress || "",
      userAgent: reqMetadata.userAgent || "",
    });
  } catch (auditErr) {
    console.error("Non-blocking feature toggle audit log error:", auditErr.message);
  }

  return await FeatureToggle.findById(toggle._id).populate("updatedBy", "fullName email");
};
