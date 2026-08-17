import {
  createReturnService,
  getMyReturnsService,
  getReturnDetailsService,
  getAllReturnsService,
  updateReturnStatusService,
  processReturnRefundService
} from "./return.service.js";

export const createReturn = async (req, res, next) => {
  try {
    const returnRequest = await createReturnService(
      req.user._id,
      req.body,
    );

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
    const isAdmin = req.user.role === "ADMIN";

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
    const returnRequest = await processReturnRefundService(
      req.params.id,
    );

    return res.status(200).json({
      success: true,
      message: "Return refund processed successfully.",
      data: returnRequest,
    });
  } catch (error) {
    next(error);
  }
};