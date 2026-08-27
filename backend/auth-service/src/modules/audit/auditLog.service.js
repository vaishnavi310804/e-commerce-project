import AuditLog from "./auditLog.model.js";

export const createAuditLog = async (data) => {
  try {
    const auditLog = await AuditLog.create(data);
    return auditLog;
  } catch (error) {
    console.error("Non-blocking Audit Log Creation Error:", error);
    return null;
  }
};

export const getAuditLogsService = async ({ page = 1, limit = 20 }) => {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  const total = await AuditLog.countDocuments();
  const logs = await AuditLog.find()
    .populate("actorId", "fullName email role")
    .populate("targetId", "fullName email role")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  return {
    logs,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum) || 1,
    },
  };
};
