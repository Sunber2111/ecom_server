const Product = require("../models/product");
const { getRatingByIdList } = require("./rating.services");

module.exports.getFilter = async (params) => {
  let paramsFilter = {};
  let limit = 10,
    page = 1;

  if (params.limit) {
    limit = parseInt(params.limit);
  }

  if (params.page) {
    page = parseInt(params.page);
  }

  const startIndex = (page - 1) * limit;

  if (params.priceTo && params.priceFrom) {
    paramsFilter["priceOnSales"] = {
      $gt: params.priceFrom,
      $lt: params.priceTo,
    };
  }

  paramsFilter["isExists"] = true;

  if (params.installment) {
    paramsFilter["installment"] = (params.installment == "true");
  }

  let data = [];

  if (params.rating) {
    const products = await Product.find(paramsFilter)
      .populate("colors.color colors.image capacities")
      .limit(limit)
      .skip(startIndex)
      .exec();

    const listId = products.map((prod) => prod._id);

    const listRating = await getRatingByIdList(listId);

    if (listRating.length === 0) return data;
    else {
      listRating.map((rate, index) => {
        if (rate >= params.rating) data.push(products[index]);
      });
    }

    if (params.capacity) {
      const cap = parseInt(params.capacity);
      let dataFinal = [];

      data.map((value, index) => {
        const ind = value.capacities.findIndex((x) => x.capacity === cap);
        if (ind !== -1) {
          dataFinal.push(data[index]);
        }
      });

      return dataFinal;
    }

    return data;
  }

  if (params.capacity) {
    const cap = parseInt(params.capacity);

    let dataFinal = [];
    data = await Product.find(paramsFilter)
      .populate("colors.color colors.image capacities")
      .limit(limit)
      .skip(startIndex)
      .exec();

    data.map((value, index) => {
      const ind = value.capacities.findIndex((x) => x.capacity === cap);
      if (ind !== -1) {
        dataFinal.push(data[index]);
      }
    });

    return dataFinal;
  }

  return await Product.find(paramsFilter)
    .populate("colors.color colors.image capacities")
    .limit(limit)
    .skip(startIndex)
    .exec();
};
