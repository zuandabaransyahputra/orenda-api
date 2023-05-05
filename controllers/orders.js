// import model
const { Order } = require("../models");

class OrderController {
  static async findAll(req, res) {
    const orders = await Order.findAll();
    return res.status(200).json({ status: "success", data: orders });
  }

  static async create(req, res) {
    let { date, sum, customerId } = req.body;

    const findOrder = await Order.findOne({ where: { email } });

    if (findOrder) res.json({ message: "DUPLICATE_EMAIL" });

    await Customer.create({
      date,
      sum,
    });

    return res
      .status(201)
      .json({ status: "success", message: "Success save customer" });
  }

  static async findById(req, res) {
    const { id } = req.params;
    const customer = await Order.findOne({
      where: { id },
    });
    if (!customer) res.json({ message: "CUSTOMER_NOT_FOUND" });
    return res.status(200).json({ status: "success", data: customer });
  }

  static async update(req, res) {
    const { id } = req.params;
    const findOrder = await Order.findOne({ where: { id } });

    if (!findOrder) res.json({ message: "CUSTOMER_NOT_FOUND" });

    const { name, phone, email, address } = req.body;

    findOrder.name = name;
    findOrder.phone = phone;
    findOrder.email = email;
    findOrder.address = address;
    await findOrder.save();

    const response = {
      id: findOrder.id,
      name: findOrder.name,
      phone: findOrder.phone,
      email: findOrder.email,
      address: findOrder.address,
    };

    return res.status(201).json({ status: "success", data: response });
  }

  static async delete(req, res) {
    const { id } = req.params;

    const findOrder = await Order.findOne({
      where: { id },
    });

    if (!findOrder) res.json({ message: "CUSTOMER_NOT_FOUND" });

    await findOrder.destroy();

    return res.status(200).json({ status: "success", message: "Deleted" });
  }
}

module.exports = OrderController;
