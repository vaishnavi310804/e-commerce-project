import Address from "./address.model.js";

export const addAddressService = async (userId, addressData) => {
  const addressCount = await Address.countDocuments({ user: userId });

  if (addressCount === 0) {
    addressData.isDefault = true;
  }
  if (addressData.isDefault) {
    await Address.updateMany(
      { user: userId },
      {
        $set: {
          isDefault: false,
        },
      },
    );
  }
  const address = await Address.create({
    user: userId,
    ...addressData,
  });

  return address;
};

export const getAllAddressService = async (userId) => {
  const addresses = await Address.find({ user: userId }).sort({
    isDefault: -1,
    createdAt: -1,
  });

  return addresses;
};

export const getAddressByIdService = async (userId, addressId) => {
  const address = await Address.findOne({
    _id: addressId,
    user: userId,
  });
  if (!address) {
    throw new Error("Address not found.");
  }
  return address;
};

export const updateAddressService = async (userId, addressId, updateData) => {
  const address = await Address.findOne({
    _id: addressId,
    user: userId,
  });

  if (!address) {
    throw new Error("Address not found.");
  }
  if (updateData.isDefault === true) {
    await Address.updateMany(
      {
        user: userId,
        _id: { $ne: addressId },
      },
      {
        $set: {
          isDefault: false,
        },
      },
    );
  }
  Object.assign(address, updateData);

  await address.save();

  return address;
};

export const deleteAddressService = async (userId, addressId) => {
  const address = await Address.findOne({
    _id: addressId,
    user: userId,
  });

  if (!address) {
    throw new Error("Address not found.");
  }

  const prevDefault = address.isDefault;

  await Address.deleteOne({
    _id: addressId,
    user: userId,
  });

  if (prevDefault) {
    const nextDefault = await Address.findOne({ user: userId })
      .sort({ createdAt: 1 });

    if (nextDefault) {
      nextDefault.isDefault = true;
      await nextDefault.save();
    }
  }

  return {
    message: "Address deleted successfully.",
  };
};
