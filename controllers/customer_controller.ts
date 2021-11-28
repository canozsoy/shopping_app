import { NextFunction, Request, Response } from 'express';
import { idValidation, orderValidation } from './validations/validations';
import verifySelf from './helpers/verify_self';
import { formatErrorValidationMessage, formatErrorDBMessage } from './helpers/format_error_message';
import CustomErrorObject from '../strategies/error_object';
import {
  Order, Product, User, OrderItems,
} from '../models';

const listAllOrders = [
  verifySelf,
  async (req : Request, res : Response, next: NextFunction) => {
    const idValidationResult = idValidation.validate(req.params.customerId);
    if (idValidationResult.error) {
      const messages = formatErrorValidationMessage(idValidationResult.error);
      return next(new CustomErrorObject(messages, 400));
    }

    const { customerId } = req.params;
    let orders;
    try {
      orders = await Order.findAll({ where: { userId: customerId } });
    } catch (err) {
      const messages = formatErrorDBMessage(err);
      return next(new CustomErrorObject(messages, 500));
    }
    if (!orders.length) {
      return next(new CustomErrorObject([{ message: 'No order found' }], 404));
    }

    return res.json({
      message: 'Successfully Found',
      orders,
    });
  },
];

const createOrder = [
  verifySelf,
  async (req : Request, res : Response, next: NextFunction) => {
    const idValidationResult = idValidation.validate(req.params.customerId);
    if (idValidationResult.error) {
      const messages = formatErrorValidationMessage(idValidationResult.error);
      return next(new CustomErrorObject(messages, 400));
    }
    const bodyValidationResult = orderValidation.validate(req.body, { abortEarly: false });
    if (bodyValidationResult.error) {
      const messages = formatErrorValidationMessage(bodyValidationResult.error);
      return next(new CustomErrorObject(messages, 400));
    }

    const { products } = req.body;
    const { customerId } = req.params;
    let queryResults;
    try {
      queryResults = await Promise.all([
        User.findOne({ where: { id: customerId } }),
        Product.findAll({
          where: {
            id: products,
          },
        }),
      ]);
    } catch (err) {
      const message = formatErrorDBMessage(err);
      return next(new CustomErrorObject(message, 500));
    }
    const [customer, productsDB] = queryResults;
    if (!customer) {
      return next(new CustomErrorObject([{ message: 'User not found' }], 404));
    }
    if (!productsDB.length) {
      return next(new CustomErrorObject([{ message: 'Products not found' }], 404));
    }
    if (products.length !== productsDB.length) {
      return next(new CustomErrorObject([{ message: 'Products not match' }], 400));
    }

    let order;
    try {
      order = await Order.create({
        date: new Date(),
        userId: customer.id,
      });
    } catch (err) {
      const message = formatErrorDBMessage(err);
      return next(new CustomErrorObject(message, 500));
    }

    const orderId = order.id;
    const queries = products.map((x:string):{} => ({
      orderId,
      productId: x,
    }));

    let orderItems;
    try {
      orderItems = await OrderItems.bulkCreate(queries, { validate: true, returning: true });
    } catch (err) {
      const messages = formatErrorDBMessage(err);
      return next(new CustomErrorObject(messages, 500));
    }

    return res.json({
      message: 'Successful Order',
      orderItems,
    });
  }];

const orderDetail = [
  verifySelf,
  async (req : Request, res : Response, next: NextFunction) => {
    const { customerId, orderId } = req.params;
    const customerIdValidationResult = idValidation.validate(customerId);
    const orderIdValidationResult = idValidation.validate(orderId);
    const error = customerIdValidationResult.error || orderIdValidationResult.error;
    if (error) {
      const messages = formatErrorValidationMessage(error);
      return next(new CustomErrorObject(messages, 400));
    }

    let queryResults;
    try {
      queryResults = await Promise.all([
        OrderItems.findAll({ where: { orderId } }),
        Order.findOne({ where: { id: orderId } }),
      ]);
    } catch (err) {
      const messages = formatErrorDBMessage(err);
      return next(new CustomErrorObject(messages, 500));
    }

    const [orderItems, order] = queryResults;

    if (!orderItems.length || !order) {
      return next(new CustomErrorObject([{ message: 'No order found' }], 404));
    }

    const productIds = orderItems.map((x) => x.productId);

    let products;
    try {
      products = await Product.findAll({ where: { id: productIds } });
    } catch (err) {
      const messages = formatErrorDBMessage(err);
      return next(new CustomErrorObject(messages, 500));
    }

    if (!products.length) {
      return next(new CustomErrorObject([{ message: 'Products not found' }], 404));
    }

    return res.json({
      message: 'Successfully Found',
      orderDetails: {
        order,
        products,
      },
    });
  },
];

export default {
  listAllOrders,
  createOrder,
  orderDetail,
};
