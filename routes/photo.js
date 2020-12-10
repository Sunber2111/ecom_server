const router = require("express").Router();
const Photo = require("../models/photo");
const { insertPhoto, deletePhoto } = require("../services/photo.services");
const upload = require("../middlewares/uploadMiddleware");

router.get("/photos", async (req, res) => {
  try {
    let photos = await Photo.find();
    res.json({
      success: true,
      photos: photos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.put("/photos/:id", upload.single("photo"), async (req, res) => {
  try {

    let photo = await Photo.findById(req.params.id);

    await deletePhoto(photo.publicId);

    const data = await insertPhoto(req.file.path);

    photo.photo = data.url;
    photo.public_id = data.public_id;

    await photo.save();

    res.json({
      success: true,
      image: data.url,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.delete("/photos/:id", async (req, res) => {
  try {
    let photo = await Photo.findOneAndDelete({ _id: req.params.id });

    await deletePhoto(photo.publicId);

    if (photo) {
      res.json({
        status: true,
        message: "Xóa ảnh Thành Công",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.post("/photos", upload.single("photo"), async (req, res) => {
  try {
    const data = await insertPhoto(req.file.path);

    let photo = new Photo();

    photo.photo = data.url;
    photo.publicId = data.public_id;

    await photo.save();

    res.json({
      success: true,
      data: photo,
      message: "Thêm Hình Ảnh Thành Công",
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
