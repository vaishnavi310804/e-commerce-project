import {
  getAllCustomersService,
  getCustomerByIdService,
  toggleCustomerStatusService,
  getCustomerStatsService,
} from "./customer.service.js";

export const getAllCustomers = async (req, res, next) => {
  try {
    const customers = await getAllCustomersService(req.query);
    return res.status(200).json({
      success: true,
      count: customers.length,
      data: customers,
    });
  } catch (error) {
    next(error);
  }
};

export const getCustomerById = async (req, res, next) => {
  try {
    const customerData = await getCustomerByIdService(req.params.id);
    return res.status(200).json({
      success: true,
      data: customerData,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleCustomerStatus = async (req, res, next) => {
  try {
    const updatedCustomer = await toggleCustomerStatusService(req.params.id);
    return res.status(200).json({
      success: true,
      message: `Customer ${updatedCustomer.isActive ? "unblocked" : "blocked"} successfully.`,
      data: updatedCustomer,
    });
  } catch (error) {
    next(error);
  }
};

export const getCustomerStats = async (req, res, next) => {
  try {
    const stats = await getCustomerStatsService();
    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};
