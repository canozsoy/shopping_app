import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { UserCreate } from './user';
import { ProductCreate } from './product';
import { OrderCreate } from './order';
import OrderItemsCreate from './order_items';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.PASSWORD as string,
  {
    host: process.env.HOST,
    dialect: 'postgres',
    logging: false,
    pool: {
      idle: 10000,
      evict: 20000,
    },
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
  Sequelize, sequelize, User, Order, Product,
};
