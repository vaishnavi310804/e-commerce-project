import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = async (fileBuffer, folder = "products") => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        }
      )
      .end(fileBuffer);
  });
};

export const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;

  return await cloudinary.uploader.destroy(publicId);
};

export default uploadToCloudinary;