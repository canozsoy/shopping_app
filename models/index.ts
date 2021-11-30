import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { UserCreate } from './user';
import { ProductCreate } from './product';
import { OrderCreate } from './order';
import OrderItemsCreate from './order_items';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_URL as string,
  {
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
  },
);

const User = UserCreate(sequelize);
const Product = ProductCreate(sequelize);
const Order = OrderCreate(sequelize);
const OrderItems = OrderItemsCreate(sequelize);

User.hasMany(Order, {
  foreignKey: 'userId',
});
Order.belongsTo(User);

Order.hasMany(OrderItems, {
  foreignKey: 'orderId',
});
OrderItems.belongsTo(Order);

Product.hasMany(OrderItems, {
  foreignKey: 'productId',
});
OrderItems.belongsTo(Product);

export {
  Sequelize, sequelize, User, Order, Product, OrderItems,
};
