import {
  createReturnService,
  getMyReturnsService,
  getReturnDetailsService,
  getAllReturnsService,
  updateReturnStatusService,
  processReturnRefundService,
  checkReturnRefundStatusService,
  processReturnReplacementService,
} from "./return.service.js";
import { sendCustomerAuditLog } from "../../services/audit.service.js";

export const createReturn = async (req, res, next) => {
  try {
    const returnRequest = await createReturnService(
      req.user._id,
      req.body,
    );

    if (returnRequest?._id) {
      sendCustomerAuditLog({
        actorId: req.user._id,
        actorRole: req.user.role || "CUSTOMER",
        module: "CUSTOMER_RETURN",
        action: "RETURN_REQUESTED",
        targetId: returnRequest._id,
        targetType: "RETURN",
        description: `Requested return for order ${returnRequest.order || ""}`,
        changes: { before: null, after: { reason: returnRequest.reason, status: returnRequest.status } },
        ipAddress: req.ip || req.headers["x-forwarded-for"] || "",
        userAgent: req.headers["user-agent"] || "",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Return request created successfully.",
      data: returnRequest,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyReturns = async (req, res, next) => {
  try {
    const returns = await getMyReturnsService(req.user._id);

    return res.status(200).json({
      success: true,
      count: returns.length,
      data: returns,
    });
  } catch (error) {
    next(error);
  }
};

export const getReturnDetails = async (req, res, next) => {
  try {
    const isAdmin = ["ADMIN", "SUPER_ADMIN"].includes(req.user.role);

    const returnRequest = await getReturnDetailsService(
      isAdmin ? null : req.user._id,
      req.params.id,
    );

    return res.status(200).json({
      success: true,
      data: returnRequest,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllReturns = async (req, res, next) => {
  try {
    const returns = await getAllReturnsService(req.query);

    return res.status(200).json({
      success: true,
      count: returns.length,
      data: returns,
    });
  } catch (error) {
    next(error);
  }
};

export const updateReturnStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const updatedReturn = await updateReturnStatusService(
      req.params.id,
      status,
    );

    return res.status(200).json({
      success: true,
      message: "Return status updated successfully.",
      data: updatedReturn,
    });
  } catch (error) {
    next(error);
  }
};

export const processReturnRefund = async (req, res, next) => {
  try {
    const result = await processReturnRefundService(
      req.params.id,
    );

    return res.status(200).json({
      success: true,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

export const checkReturnRefundStatus = async (req, res, next) => {
  try {
    const result = await checkReturnRefundStatusService(
      req.params.id,
    );

    return res.status(200).json({
      success: true,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

export const processReturnReplacement = async (req, res, next) => {
  try {
    const result = await processReturnReplacementService(req.params.id);

    return res.status(200).json({
      success: true,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};