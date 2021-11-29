import {
  Order, User, Product, OrderItems,
} from '../../models';
import CustomErrorObject from '../../strategies/error_object';
import { formatErrorDBMessage } from './format_error_message';

interface FindOptionsAttributes {
  where: {
    [key: string] : {}
  }
}

interface CreateOrderAttributes {
  date: Date,
  userId: string
}

interface CreateUserAttributes {
  username: string,
  password: string,
  role?: string
}

const findAllOrders = async (options:FindOptionsAttributes) => {
  let orders;
  try {
    orders = await Order.findAll(options);
  } catch (err) {
    const messages = formatErrorDBMessage(err);
    return { error: new CustomErrorObject(messages), orders };
  }
  if (!orders.length) {
    return { error: new CustomErrorObject([{ message: 'No order found' }], 404), orders };
  }
  return { orders, error: null };
};

const findAndCompareUserAndProduct = async (
  userOptions:FindOptionsAttributes,
  productOptions:FindOptionsAttributes,
  products:string[],
) => {
  let queryResults;
  try {
    queryResults = await Promise.all([
      User.findOne(userOptions),
      Product.findAll(productOptions),
    ]);
  } catch (err) {
    const message = formatErrorDBMessage(err);
    return { error: new CustomErrorObject(message) };
  }
  const [customer, productsDB] = queryResults;
  if (!customer) {
    return { error: new CustomErrorObject([{ message: 'User not found' }], 404) };
  }
  if (!productsDB.length) {
    return { error: new CustomErrorObject([{ message: 'Products not found' }], 404) };
  }
  if (products.length !== productsDB.length) {
    return { error: new CustomErrorObject([{ message: 'Product number not match and please don\'t order same thing :)' }], 400) };
  }
  return { error: null, customer };
};

const createOrderCall = async (value:CreateOrderAttributes) => {
  let order;
  try {
    order = await Order.create(value);
  } catch (err) {
    const message = formatErrorDBMessage(err);
    return { error: new CustomErrorObject(message), order: null };
  }
  return { order, error: null };
};

const bulkCreateOrderItems = async (queries:[]) => {
  let orderItems;
  try {
    orderItems = await OrderItems.bulkCreate(queries, { validate: true, returning: true });
  } catch (err) {
    const messages = formatErrorDBMessage(err);
    return { error: new CustomErrorObject(messages), orderItems };
  }
  return { orderItems, error: null };
};

const findOrderAndOrderItems = async (
  orderQuery:FindOptionsAttributes,
  orderItemQuery:FindOptionsAttributes,
) => {
  let queryResults;
  try {
    queryResults = await Promise.all([
      OrderItems.findAll(orderItemQuery),
      Order.findOne(orderQuery),
    ]);
  } catch (err) {
    const messages = formatErrorDBMessage(err);
    return { error: new CustomErrorObject(messages), orderItems: null, order: null };
  }
  const [orderItems, order] = queryResults;

  if (!orderItems.length || !order) {
    return {
      error: new CustomErrorObject([{ message: 'No order found' }], 404),
      orderItems: null,
      order: null,
    };
  }
  return { orderItems, order, error: null };
};

const findAllProduct = async (options:FindOptionsAttributes) => {
  let products;
  try {
    products = await Product.findAll(options);
  } catch (err) {
    const messages = formatErrorDBMessage(err);
    return { error: new CustomErrorObject(messages, 500), products: null };
  }

  if (!products.length) {
    return {
      err: new CustomErrorObject(
        [
          { message: 'Products not found' }],
        404,
      ),
      products: null,
    };
  }
  return { error: null, products };
};

const findUser = async (options:FindOptionsAttributes) => {
  let currentUser;
  try {
    currentUser = await User.findOne(options);
  } catch (err) {
    const messages = formatErrorDBMessage(err);
    return { error: new CustomErrorObject(messages), currentUser: null };
  }
  if (!currentUser) {
    return { error: new CustomErrorObject([{ message: 'Incorrect username or password' }], 401), currentUser: null };
  }
  return { error: null, currentUser };
};

const userCreate = async (values:CreateUserAttributes) => {
  let newUser;
  try {
    newUser = await User.create(values);
  } catch (err) {
    const messages = formatErrorDBMessage(err);
    return { error: new CustomErrorObject(messages, 400), newUser: null };
  }
  return { error: null, newUser };
};

export {
  findAllOrders,
  findAndCompareUserAndProduct,
  createOrderCall,
  bulkCreateOrderItems,
  findOrderAndOrderItems,
  findAllProduct,
  findUser,
  userCreate,
};
