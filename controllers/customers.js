// import model
const { Op } = require('sequelize');
const { Customer } = require('../models');
const { FormatPagination } = require('../utils/format-pagination');
const {
  formulaPaginationOffsetLimit,
} = require('../utils/formula-pagination-offset-limit');

class CustomerController {
  static async findAll(req, res) {
    const { limit = 10, page = 0, keyword = '', sortOrder = [] } = req.query;

    let condition = {};
    if (keyword !== '') {
      condition = { ...condition, name: { [Op.like]: `%${keyword}%` } };
    }

    let convertSortOrder = [];
    sortOrder.forEach((sO) => {
      convertSortOrder.push([sO.split(' ')[0], sO.split(' ')[1]]);
    });

    const { offset, limitData } = formulaPaginationOffsetLimit(page, limit);

    const count = await Customer.count({ where: condition });

    const customers = await Customer.findAll({
      where: condition,
      order: convertSortOrder,
      limit: Number(limitData),
      offset: offset,
    });

    const { pages, total } = FormatPagination(count, limitData);

    return res
      .status(200)
      .json({ status: 'success', data: customers, total, pages });
  }

  static async create(req, res) {
    let { name, phone, email, address } = req.body;

    const findCustomer = await Customer.findOne({ where: { email } });

    if (findCustomer) res.json({ message: 'DUPLICATE_EMAIL' });

    await Customer.create({
      name,
      phone,
      email,
      address,
    });

    return res
      .status(201)
      .json({ status: 'success', message: 'Success save customer' });
  }

  static async findById(req, res) {
    const { id } = req.params;
    const customer = await Customer.findOne({
      where: { id },
    });
    if (!customer) res.json({ message: 'CUSTOMER_NOT_FOUND' });
    return res.status(200).json({ status: 'success', data: customer });
  }

  static async update(req, res) {
    const { id } = req.params;
    const findCustomer = await Customer.findOne({ where: { id } });

    if (!findCustomer) res.json({ message: 'CUSTOMER_NOT_FOUND' });

    const { name, phone, email, address } = req.body;

    findCustomer.name = name;
    findCustomer.phone = phone;
    findCustomer.email = email;
    findCustomer.address = address;
    await findCustomer.save();

    const response = {
      id: findCustomer.id,
      name: findCustomer.name,
      phone: findCustomer.phone,
      email: findCustomer.email,
      address: findCustomer.address,
    };

    return res.status(201).json({ status: 'success', data: response });
  }

  static async delete(req, res) {
    const { id } = req.params;

    const findCustomer = await Customer.findOne({
      where: { id },
    });

    if (!findCustomer) res.json({ message: 'CUSTOMER_NOT_FOUND' });

    await findCustomer.destroy();

    return res.status(200).json({ status: 'success', message: 'Deleted' });
  }
}

module.exports = CustomerController;
