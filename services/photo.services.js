const cloudinary = require("../configs/cloudinary");

module.exports.insertPhoto = async (data) => {

  const { url, public_id } = await cloudinary.uploader.upload(data, {
    upload_preset: "gk_cnm",
  });

  return { url, public_id };
};

module.exports.deletePhoto = async (public_id) => {

  await cloudinary.uploader.destroy(public_id);
  
};
