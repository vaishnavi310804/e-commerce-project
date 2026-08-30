import {
  createRoleService,
  getAllRolesService,
  getRoleByIdService,
  updateRoleService,
  deleteRoleService,
} from "./role.service.js";
import { createAuditLog } from "../audit/auditLog.service.js";

export const createRole = async (req, res, next) => {
  try {
    const role = await createRoleService(req.body, req.user._id);

    createAuditLog({
      actorId: req.user._id,
      actorRole: req.user.role,
      module: "ROLES",
      action: "ADMIN_CREATED", // or ROLE_CREATED
      targetId: role._id,
      targetType: "ROLE",
      description: `Created custom role: ${role.name}`,
      changes: { before: null, after: { name: role.name, permissions: role.permissions } },
      ipAddress: req.ip || req.headers["x-forwarded-for"] || "",
      userAgent: req.headers["user-agent"] || "",
    });

    return res.status(201).json({
      success: true,
      message: "Role created successfully.",
      data: role,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllRoles = async (req, res, next) => {
  try {
    const roles = await getAllRolesService();
    return res.status(200).json({
      success: true,
      count: roles.length,
      data: roles,
    });
  } catch (error) {
    next(error);
  }
};

export const getRoleById = async (req, res, next) => {
  try {
    const role = await getRoleByIdService(req.params.id);
    return res.status(200).json({
      success: true,
      data: role,
    });
  } catch (error) {
    next(error);
  }
};

export const updateRole = async (req, res, next) => {
  try {
    const role = await updateRoleService(req.params.id, req.body);

    createAuditLog({
      actorId: req.user._id,
      actorRole: req.user.role,
      module: "ROLES",
      action: "ADMIN_UPDATED",
      targetId: role._id,
      targetType: "ROLE",
      description: `Updated role: ${role.name}`,
      changes: { before: null, after: { name: role.name, permissions: role.permissions } },
      ipAddress: req.ip || req.headers["x-forwarded-for"] || "",
      userAgent: req.headers["user-agent"] || "",
    });

    return res.status(200).json({
      success: true,
      message: "Role updated successfully.",
      data: role,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteRole = async (req, res, next) => {
  try {
    const result = await deleteRoleService(req.params.id);

    createAuditLog({
      actorId: req.user._id,
      actorRole: req.user.role,
      module: "ROLES",
      action: "ADMIN_DEACTIVATED",
      targetId: req.params.id,
      targetType: "ROLE",
      description: `Deleted role ID: ${req.params.id}`,
      changes: null,
      ipAddress: req.ip || req.headers["x-forwarded-for"] || "",
      userAgent: req.headers["user-agent"] || "",
    });

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};
