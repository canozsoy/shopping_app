import {
  Model, DataTypes, Optional, Sequelize,
} from 'sequelize';

interface OrderItemsAttributes {
  id: string,
  orderId: string,
  productId: string
}

interface OrderItemsCreationAttributes extends Optional<OrderItemsAttributes, 'id'> {}
interface OrderItemsInstance extends Model<OrderItemsAttributes, OrderItemsCreationAttributes> {}

const OrderItemsCreate = (sequelize: Sequelize) => sequelize
  .define<OrderItemsInstance>('order_items', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});

export default OrderItemsCreate;
