import ecommerceApi from "./ecommerceApi";

export const createShipment = async (shipmentData) => {
  const data = await ecommerceApi.post("/shipment", shipmentData);
  return data;
};

export const getAllShipments = async (params = {}) => {
  const { data } = await ecommerceApi.get("/shipment", { params });
  return data;
};

export const updateShipmentStatus = async (
  shipmentId,
  statusData,
) => {
  const { data } = await ecommerceApi.patch(
    `/shipment/${shipmentId}/status`,
    statusData,
  );

  return data;
};

export const getShipmentDetails = async (shipmentId) => {
  const { data } = await ecommerceApi.get(
    `/shipment/${shipmentId}`,
  );

  return data;
};