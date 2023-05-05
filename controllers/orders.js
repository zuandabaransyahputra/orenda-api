// import model
const { Order, DetailOrder, Product } = require('../models');
const sequelize = require('../models').sequelize;

class OrderController {
  static async findAll(req, res) {
    const orders = await Order.findAll({
      include: [
        {
          model: DetailOrder,
          as: 'details',
        },
      ],
    });
    return res.status(200).json({ status: 'success', data: orders });
  }

  static async create(req, res) {
    const transaction = await sequelize.transaction();
    try {
      const { customerId, products } = req.body;
      console.log(products);

      const resOrder = await Order.create(
        {
          date: new Date(),
          sum: 0,
          customerId,
        },
        { transaction }
      );

      let sum = 0;
      let temp = [];
      for (const product of products) {
        const checkingProduct = await Product.findOne({
          where: { id: product.id },
        });

        if (!checkingProduct)
          res.status(404).json({ message: 'Product Not found' });

        if (product.qty > checkingProduct.unit)
          res.status(404).json({ message: 'Stock Product tidak cukup' });

        await checkingProduct.update(
          {
            unit: checkingProduct.unit - product.qty,
          },
          { transaction }
        );

        temp.push({
          productId: checkingProduct.id,
          qty: product.qty,
          orderId: resOrder.id,
          price: checkingProduct.price,
        });

        sum += checkingProduct.price * product.qty;
      }

      const resDetailOrders = await DetailOrder.bulkCreate(temp, {
        transaction,
      });

      await resOrder.update(
        {
          sum,
        },
        { transaction }
      );

      await transaction.commit();

      return res.status(201).json({
        status: 'success',
        data: { ...resOrder.dataValues, details: resDetailOrders },
      });
    } catch (err) {
      if (transaction) await transaction.rollback();

      res.status(500).json({
        message: err.message || 'Internal Server Error',
      });
    }
  }

  static async findById(req, res) {
    const { id } = req.params;
    const customer = await Order.findOne({
      where: { id },
    });
    if (!customer) res.json({ message: 'CUSTOMER_NOT_FOUND' });
    return res.status(200).json({ status: 'success', data: customer });
  }

  static async update(req, res) {
    const { id } = req.params;
    const findOrder = await Order.findOne({ where: { id } });

    if (!findOrder) res.json({ message: 'CUSTOMER_NOT_FOUND' });

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

    return res.status(201).json({ status: 'success', data: response });
  }

  static async delete(req, res) {
    const { id } = req.params;

    const findOrder = await Order.findOne({
      where: { id },
    });

    if (!findOrder) res.json({ message: 'CUSTOMER_NOT_FOUND' });

    await findOrder.destroy();

    return res.status(200).json({ status: 'success', message: 'Deleted' });
  }
}

module.exports = OrderController;
