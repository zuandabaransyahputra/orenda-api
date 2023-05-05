const { Product } = require("../models");

class ProductController {
  static async findAll(req, res) {
    const products = await Product.findAll();
    return res.status(200).json({ status: "success", data: products });
  }

  static async create(req, res) {
    let { name, unit, price } = req.body;

    const findProduct = await Product.findOne({ where: { name } });

    if (findProduct) res.json({ message: "DUPLICATE_NAME" });

    await Product.create({
      name,
      price,
      unit,
    });

    return res
      .status(201)
      .json({ status: "success", message: "Success save product" });
  }

  static async findById(req, res) {
    const { id } = req.params;
    const product = await Product.findOne({
      where: { id },
    });
    if (!product) res.json({ message: "PRODUCT_NOT_FOUND" });
    return res.status(200).json({ status: "success", data: product });
  }

  static async update(req, res) {
    const { id } = req.params;
    const findProduct = await Product.findOne({ where: { id } });

    if (!findProduct) res.json({ message: "PRODUCT_NOT_FOUND" });

    const { name, price, unit } = req.body;

    findProduct.name = name;
    findProduct.price = price;
    findProduct.unit = unit;
    await findProduct.save();

    const response = {
      id: findProduct.id,
      name: findProduct.name,
      price: findProduct.price,
      unit: findProduct.unit,
    };

    return res.status(201).json({ status: "success", data: response });
  }

  static async delete(req, res) {
    const { id } = req.params;

    const findProduct = await Product.findOne({
      where: { id },
    });

    if (!findProduct) res.json({ message: "PRODUCT_NOT_FOUND" });

    await findProduct.destroy();

    return res.status(200).json({ status: "success", message: "Deleted" });
  }
}

module.exports = ProductController;
