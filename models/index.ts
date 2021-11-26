import { Sequelize } from 'sequelize';
import dbConfig from '../db_config.json';
import { UserCreate } from './user';
import { ProductCreate } from './product';
import { OrderCreate } from './order';
import OrderItemsCreate from './order_items';

const sequelize = new Sequelize(
  dbConfig.DB_NAME as string,
  dbConfig.USERNAME as string,
  dbConfig.PASSWORD as string,
  {
    host: dbConfig.HOST,
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
