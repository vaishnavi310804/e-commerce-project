import Session from "./session.model.js";
import User from "../auth/auth.model.js";
import { createAuditLog } from "../audit/auditLog.service.js";

export const getSessionsService = async ({
  page = 1,
  limit = 10,
  search = "",
  role = "",
  status = "",
}) => {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
  const skip = (pageNum - 1) * limitNum;

  const filter = {};

  // Status Filter
  if (status) {
    const upperStatus = String(status).toUpperCase();
    if (upperStatus === "ACTIVE") {
      filter.isRevoked = false;
      filter.expiresAt = { $gt: new Date() };
    } else if (upperStatus === "REVOKED") {
      filter.isRevoked = true;
    } else if (upperStatus === "EXPIRED") {
      filter.isRevoked = false;
      filter.expiresAt = { $lte: new Date() };
    }
  }

  // Role Filter
  if (role && role !== "ALL") {
    filter.role = String(role).toUpperCase();
  }

  // Search Filter by User Name or Email
  if (search && String(search).trim() !== "") {
    const searchRegex = new RegExp(String(search).trim(), "i");
    const matchedUsers = await User.find(
      {
        $or: [{ fullName: searchRegex }, { email: searchRegex }],
      },
      "_id"
    );

    const userIds = matchedUsers.map((u) => u._id);
    filter.userId = { $in: userIds };
  }

  const total = await Session.countDocuments(filter);
  const sessions = await Session.find(filter)
    .populate({
      path: "userId",
      select: "fullName email role roleId profileImage",
      populate: { path: "roleId", select: "name" },
    })
    .sort({ loginAt: -1, createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  return {
    sessions,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum) || 1,
    },
  };
};

export const revokeSessionService = async (
  sessionId,
  superAdminUser,
  currentSessionId = null
) => {
  if (
    currentSessionId &&
    String(sessionId) === String(currentSessionId)
  ) {
    const error = new Error("You cannot force logout your own current session.");
    error.statusCode = 400;
    throw error;
  }

  const session = await Session.findById(sessionId);
  if (!session) {
    const error = new Error("Session not found.");
    error.statusCode = 404;
    throw error;
  }

  if (
    superAdminUser?._id &&
    String(session.userId) === String(superAdminUser._id) &&
    session.role === "SUPER_ADMIN"
  ) {
    // If it's the current Super Admin's own session id check
    if (currentSessionId && String(sessionId) === String(currentSessionId)) {
      const error = new Error("You cannot force logout your own current session.");
      error.statusCode = 400;
      throw error;
    }
  }

  if (session.isRevoked) {
    return session;
  }

  session.isRevoked = true;
  session.revokedAt = new Date();
  await session.save();

  try {
    await createAuditLog({
      actorId: superAdminUser._id,
      actorRole: "SUPER_ADMIN",
      module: "SESSION_MANAGEMENT",
      action: "SESSION_FORCE_LOGOUT",
      targetId: session.userId,
      targetType: "SESSION",
      description: `Super Admin force logged out user session (${session._id})`,
      changes: {
        before: { isRevoked: false },
        after: { isRevoked: true, revokedAt: session.revokedAt },
      },
      ipAddress: "",
      userAgent: "",
    });
  } catch (err) {
    console.error("Non-blocking audit log creation error on session revoke:", err);
  }

  return session;
};
