'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.hasMany(models.DetailOrder, {
        foreignKey: 'orderId',
        as: 'details',
      });
    }
  }
  Order.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      date: DataTypes.DATE,
      sum: DataTypes.INTEGER,
      customerId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Customers',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'Order',
    }
  );
  return Order;
};
