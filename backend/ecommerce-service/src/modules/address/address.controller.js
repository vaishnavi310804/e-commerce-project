import { addAddressService, getAllAddressService, getAddressByIdService, updateAddressService, deleteAddressService, getDefaultAddressService } from "./address.service.js";

export const addAddress = async (req, res, next) => {
  try {
    const address = await addAddressService(
      req.user._id,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Address added successfully.",
      data: address,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllAddress = async (req, res, next) => {
  try {
    const addresses = await getAllAddressService(req.user._id);
    res.status(200).json({
      success: true,
      count: addresses.length,
      data: addresses,
    });
  } catch (error) {
    next(error);
  }
};

export const getAddressById = async (req, res, next) => {
  try {
    const address = await getAddressByIdService(
      req.user._id,
      req.params.id
    );

    res.status(200).json({
      success: true,
      data: address,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAddress = async (req, res, next) => {
  try {
    const address = await updateAddressService(
      req.user._id,
      req.params.id,
      req.body
    );
    res.status(200).json({
      success: true,
      message: "Address updated successfully.",
      data: address,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAddress = async (req, res, next) => {
  try {
    const result = await deleteAddressService(
      req.user._id,
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

export const getDefaultAddress = async (req, res, next) => {
  try {
    const address = await getDefaultAddressService(req.user._id);

    res.status(200).json({
      success: true,
      data: address,
    });
  } catch (error) {
    next(error);
  }
};