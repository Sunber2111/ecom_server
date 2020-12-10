const router = require("express").Router();
const Product = require("../models/product");
const Color = require("../models/color");
const { deletePhoto } = require("../services/photo.services");
const photo = require("../models/photo");

// POST request
router.post("/colors", async (req, res) => {
  try {
    const color = new Color();
    color.indexColor = req.body.indexColor;
    color.nameColor = req.body.nameColor;
    color.plusCost = req.body.plusCost;
    await color.save();

    res.json({
      success: true,
      message: "Successfully created a new color",
      id: color._id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

//GET request
router.get("/colors", async (req, res) => {
  try {
    let colors = await Color.find();
    res.json({
      success: true,
      colors: colors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

//PUT request = Update a single product
router.put("/colors/:id", async (req, res) => {
  try {
    let colors = await Color.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          indexColor: req.body.indexColor,
          nameColor: req.body.nameColor,
          plusCost: req.body.plusCost,
        },
      },
      {
        upsert: true,
      }
    );
    res.json({
      success: true,
      updateColors: colors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

//DELETE request = delete a single product
router.delete("/colors/:id/:productId", async (req, res) => {
  try {
    let deletedColor = await Color.findOneAndDelete({ _id: req.params.id });
    let product = await Product.findById(req.params.productId);
    const index = product.colors.findIndex(
      (x) => x.color + "" == req.params.id + ""
    );
    if (index !== -1) {
      const imageId = product.colors[index].image;


      product.colors.splice(index, 1);

      const deleteImage = await photo.findByIdAndDelete({ _id: imageId });

      await product.save();

      await deletePhoto(deleteImage.publicId);
    }

    if (deletedColor) {
      res.json({
        status: true,
        message: "Successfully deleted",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
