const router = require("express").Router();
const Product = require("../models/product");
const { getFilter } = require("../services/product.services");

router.get("/products/getFast", async (req, res) => {
  try {
    let data = await Product.find().populate(
      "colors.color colors.image capacities"
    );

    const filter = data.map((sub) => {
      const { _id, name, priceOnSales, isExists, colors } = sub;
      let photo = "";
      if (colors[0] && colors[0].image && colors[0].image.photo)
        photo = colors[0].image.photo;
      return {
        _id,
        name,
        priceOnSales,
        isExists,
        photo,
      };
    });

    res.json({
      success: true,
      data: filter,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.post("/products", async (req, res) => {
  try {
    delete req.body._id;
    let product = new Product(req.body);

    await product.save();

    res.json({
      success: true,
      message: "Successfilly create new product",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.post("/products/getmanybyid", async (req, res) => {
  try {
    // ids = [ '1','2',.....]
    const { ids } = req.body;

    let arr = [];
    for (let index = 0; index < ids.length; index++) {
      const id = ids[index];
      const data = await Product.findById(id)
        .populate("colors.color colors.image capacities")
        .exec();
      // data = {id ='1', name='abc' ,.....}
      arr.push(data);
    }
    return res.json({
      success: true,
      data: arr,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/products/totalpage", async (req, res) => {
  const countProducts = await Product.countDocuments({});
  console.log(countProducts);
  res.status(200).json({
    totalPage: Math.ceil(countProducts / 10),
  });
});

router.get("/products", async (req, res) => {
  try {
    let products = await Product.find()
      .select("-capacities -colors.color -colors._id")
      .populate("colors.image");

    let data = products.sort((a, b) => a.priceOnSales - b.priceOnSales);

    res.json({
      success: true,
      products: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/products/filter", async (req, res) => {
  try {
    const data = await getFilter(req.query);
    let dataFinal = data.sort((a, b) => b.priceOnSales - a.priceOnSales);
    res.json({
      success: true,
      products: dataFinal,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/products/:id", async (req, res) => {
  try {
    let product = await Product.findOne({ _id: req.params.id })
      .populate("colors.color colors.image capacities")
      .exec();
    res.json({
      success: true,
      product: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/products/updatestate/:id", async (req, res) => {
  try {
    let product = await Product.findOne({ _id: req.params.id });
    product.isExists = !product.isExists;
    await product.save();
    res.json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.put("/products", async (req, res) => {
  try {
    let product = await Product.findById(req.body._id);
    console.log(req.body);
    for (let x in req.body) {
      if (product[x] && x !== "colors" && x !== "capacities") {
        product[x] = req.body[x];
      }
    }

    await product.save();

    res.json({
      success: true,
      updateProduct: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.delete("/products/:id", async (req, res) => {
  try {
    let deletedProduct = await Product.findOneAndDelete({ _id: req.params.id });
    if (deletedProduct) {
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

router.get(
  "/products/insert_new_color/:productId/:idColor/:idPhoto",
  async (req, res) => {
    try {
      const { idColor, idPhoto, productId } = req.params;
      let data = await Product.findById(productId);
      data.colors.push({ color: idColor, image: idPhoto });
      await data.save();

      return res.json({
        status: true,
        message: "Thêm thành công",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

module.exports = router;
