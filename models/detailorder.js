'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DetailOrder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      DetailOrder.belongsTo(models.Order, {
        foreignKey: 'id',
      });
    }
  }
  DetailOrder.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      orderId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Orders',
          key: 'id',
        },
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Products',
          key: 'id',
        },
      },
      price: DataTypes.INTEGER,
      qty: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'DetailOrder',
    }
  );
  return DetailOrder;
};
