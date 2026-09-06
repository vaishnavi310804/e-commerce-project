import {
  getSessionsService,
  revokeSessionService,
} from "./session.service.js";

export const getSessions = async (req, res, next) => {
  try {
    const { page, limit, search, role, status } = req.query;

    const result = await getSessionsService({
      page,
      limit,
      search,
      role,
      status,
    });

    return res.status(200).json({
      success: true,
      data: result.sessions,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const revokeSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const currentSessionId = req.sessionId || req.user?.sessionId || null;

    if (!req.user || req.user.role !== "SUPER_ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only Super Admin can force logout sessions.",
      });
    }

    const updatedSession = await revokeSessionService(
      sessionId,
      req.user,
      currentSessionId
    );

    return res.status(200).json({
      success: true,
      message: "Session successfully force logged out.",
      data: updatedSession,
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
