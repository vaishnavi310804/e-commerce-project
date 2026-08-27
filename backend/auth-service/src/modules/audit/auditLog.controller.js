import { getAuditLogsService } from "./auditLog.service.js";

export const getAuditLogs = async (req, res, next) => {
  try {
    const result = await getAuditLogsService(req.query);

    return res.status(200).json({
      success: true,
      data: result.logs,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};
