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
  (req : Request, res : Response) => {
    res.sendStatus(200);
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
    if (!products.length) {
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
  (req : Request, res : Response) => {
    res.sendStatus(200);
  },
];

export default {
  listAllOrders,
  createOrder,
  orderDetail,
};
