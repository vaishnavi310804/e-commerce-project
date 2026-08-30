import Role from "../modules/roles/role.model.js";
import User from "../modules/auth/auth.model.js";

export const ALL_MODULES = [
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
  "ADMIN_LOGS",
  "ADMIN_USERS",
  "ROLES",
  "SESSIONS",
];

export const ALL_ACTIONS = ["VIEW", "CREATE", "EDIT", "DELETE"];

export const seedDefaultRoles = async () => {
  try {
    // 1. Ensure SUPER_ADMIN system role exists
    let superAdminRole = await Role.findOne({ name: "SUPER_ADMIN" });
    if (!superAdminRole) {
      superAdminRole = await Role.create({
        name: "SUPER_ADMIN",
        description: "System Super Admin with unrestricted access across all modules",
        isSystemRole: true,
        permissions: ALL_MODULES.map((mod) => ({
          module: mod,
          actions: ALL_ACTIONS,
        })),
        isActive: true,
      });
      console.log("Seeded default SUPER_ADMIN system role.");
    }

    // 2. Ensure FULL_ADMIN system role exists for default admins
    let fullAdminRole = await Role.findOne({ name: "FULL_ADMIN" });
    if (!fullAdminRole) {
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
      fullAdminRole = await Role.create({
        name: "FULL_ADMIN",
        description: "Default full admin access to standard business modules",
        isSystemRole: true,
        permissions: standardModules.map((mod) => ({
          module: mod,
          actions: ALL_ACTIONS,
        })),
        isActive: true,
      });
      console.log("Seeded default FULL_ADMIN system role.");
    }

    // 3. Auto-migrate existing ADMIN users missing a roleId
    const unassignedAdmins = await User.find({
      role: "ADMIN",
      $or: [{ roleId: null }, { roleId: { $exists: false } }],
    });

    if (unassignedAdmins.length > 0 && fullAdminRole?._id) {
      await User.updateMany(
        { role: "ADMIN", $or: [{ roleId: null }, { roleId: { $exists: false } }] },
        { $set: { roleId: fullAdminRole._id } }
      );
      console.log(`Auto-migrated ${unassignedAdmins.length} unassigned ADMIN user(s) to default FULL_ADMIN role.`);
    }
  } catch (error) {
    console.error("Error seeding default roles:", error.message);
  }
};
