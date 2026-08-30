import Role from "./role.model.js";
import User from "../auth/auth.model.js";

export const createRoleService = async (roleData, createdById) => {
  const existingRole = await Role.findOne({ name: String(roleData.name).trim() });
  if (existingRole) {
    throw new Error("A role with this name already exists.");
  }

  const role = await Role.create({
    ...roleData,
    name: String(roleData.name).trim(),
    createdBy: createdById,
  });

  return role;
};

export const getAllRolesService = async () => {
  const roles = await Role.find().sort({ createdAt: -1 });

  // Count assigned admins for each role
  const rolesWithCount = await Promise.all(
    roles.map(async (role) => {
      const assignedCount = await User.countDocuments({ roleId: role._id });
      return {
        ...role.toObject(),
        assignedAdminsCount: assignedCount,
      };
    })
  );

  return rolesWithCount;
};

export const getRoleByIdService = async (roleId) => {
  const role = await Role.findById(roleId);
  if (!role) {
    throw new Error("Role not found.");
  }
  const assignedCount = await User.countDocuments({ roleId: role._id });
  return {
    ...role.toObject(),
    assignedAdminsCount: assignedCount,
  };
};

export const updateRoleService = async (roleId, updateData) => {
  const role = await Role.findById(roleId);
  if (!role) {
    throw new Error("Role not found.");
  }

  if (role.isSystemRole && updateData.name && updateData.name !== role.name) {
    throw new Error("System role names cannot be modified.");
  }

  if (updateData.name && updateData.name !== role.name) {
    const existingRole = await Role.findOne({ name: String(updateData.name).trim() });
    if (existingRole) {
      throw new Error("A role with this name already exists.");
    }
  }

  Object.assign(role, updateData);
  await role.save();
  return role;
};

export const deleteRoleService = async (roleId) => {
  const role = await Role.findById(roleId);
  if (!role) {
    throw new Error("Role not found.");
  }

  if (role.isSystemRole) {
    throw new Error("System roles cannot be deleted.");
  }

  const assignedAdminsCount = await User.countDocuments({ roleId: role._id });
  if (assignedAdminsCount > 0) {
    throw new Error(
      `Cannot delete role. It is currently assigned to ${assignedAdminsCount} admin(s). Please reassign them first.`
    );
  }

  await Role.findByIdAndDelete(roleId);
  return { success: true, message: "Role deleted successfully." };
};
