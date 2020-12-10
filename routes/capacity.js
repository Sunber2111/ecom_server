const router = require("express").Router();
const Capacity = require("../models/capacity");
const Product = require("../models/product");

// POST request
router.post("/capacities", async (req, res) => {
  try {
    let capacity = new Capacity();
    capacity.capacity = req.body.capacity;
    capacity.plusCost = req.body.plusCost;

    await capacity.save();

    let product = await Product.findById(req.body.productId);

    product.capacities.push(capacity._id);

    await product.save();

    res.json({
      success: true,
      message: "Successfully created a new capacity",
      id: capacity._id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

//GET request
router.get("/capacities", async (req, res) => {
  try {
    let capacities = await Capacity.find();
    let data = {
      capacities: capacities,
    };
    res.json({
      success: true,
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
//PUT request = Update a single product
router.put("/capacities/:id", async (req, res) => {
  try {
    let capacity = await Capacity.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          capacity: req.body.capacity,
          plusCost: req.body.plusCost,
        },
      },
      {
        upsert: true,
      }
    );
    res.json({
      success: true,
      updateCapacity: capacity,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

//DELETE request = delete a single product
router.delete("/capacities/:id/:productId", async (req, res) => {
  try {
    let deletedCapacity = await Capacity.findOneAndDelete({
      _id: req.params.id,
    });

    //
    //
    //
    let product = await Product.findById(req.params.productId);
    const index = product.capacities.findIndex((x) => x === req.params.id);
    if (index !== -1) product.capacities.splice(index, 1);
    await product.save();
    //
    //
    //

    if (deletedCapacity) {
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
