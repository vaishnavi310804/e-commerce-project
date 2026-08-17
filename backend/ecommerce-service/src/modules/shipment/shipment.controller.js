import {
  createShipmentService,
  getAllShipmentsService,
  getShipmentDetailsService,
  getShipmentByOrderService,
  updateShipmentStatusService,
} from "./shipment.service.js";

export const createShipment = async (req, res, next) => {
  try {
    const shipment = await createShipmentService(req.body);
    return res.status(201).json({
      success: true,
      message: "Shipment Created Successfully",
      data: shipment,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllShipments = async (req, res, next) => {
  try {
    const shipments = await getAllShipmentsService(req.query);
    return res.status(200).json({
      success: true,
      count: shipments.length,
      data: shipments,
    });
  } catch (error) {
    next(error);
  }
};

export const getShipmentDetails = async (req, res, next) => {
  try {
    const shipment = await getShipmentDetailsService(req.params.id);
    return res.status(200).json({
      success: true,
      data: shipment,
    });
  } catch (error) {
    next(error);
  }
};

export const updateShipmentStatus = async (req, res, next) => {
  try {
    const { status, message, location } = req.body;
    const updatedShipment = await updateShipmentStatusService(
      req.params.id,
      status,
      message,
      location,
    );
    return res.status(200).json({
      success: true,
      message: "Shipment status updated",
      data: updatedShipment,
    });
  } catch (error) {
    next(error);
  }
};

export const getShipmentByOrder = async (req, res, next) => {
  try {
    const shipment = await getShipmentByOrderService(
      req.params.orderId,
      req.user._id,
    );

    return res.status(200).json({
      success: true,
      data: shipment,
    });
  } catch (error) {
    next(error);
  }
};
