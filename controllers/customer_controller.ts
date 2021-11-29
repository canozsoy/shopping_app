import { NextFunction, Request, Response } from 'express';
import { orderValidation } from './validations/validations';
import { idValidationMiddleware, bodyValidationMiddleware } from './helpers/validation_middlewares';
import {
  findAllOrders,
  findAndCompareUserAndProduct,
  createOrderCall,
  bulkCreateOrderItems,
  findOrderAndOrderItems,
  findAllProduct,
} from './helpers/database_requests';

const listAllOrders = async (req : Request, res : Response, next: NextFunction) => {
  const customerId = res.locals.user.id;
  const options = {
    where: {
      userId: customerId,
    },
  };

  const { orders, error } = await findAllOrders(options);
  if (error) {
    return next(error);
  }

  return res.json({
    message: 'Successfully Found',
    orders,
  });
};

const createOrder = [
  bodyValidationMiddleware(orderValidation),
  async (req : Request, res : Response, next: NextFunction) => {
    const { products } = req.body;
    const customerId = res.locals.user.id;
    const userQuery = {
      where: {
        id: customerId,
      },
    };
    const productQuery = {
      where: {
        id: products,
      },
    };

    const { error: errorCompare, customer } = await findAndCompareUserAndProduct(
      userQuery,
      productQuery,
      products,
    );
    if (errorCompare || !customer) {
      return next(errorCompare);
    }

    const createOrderQuery = {
      date: new Date(),
      userId: customer.id,
    };

    const { error: errorCreateOrder, order } = await createOrderCall(createOrderQuery);

    if (errorCreateOrder || !order) {
      return next(errorCreateOrder);
    }

    const orderId = order.id;
    const queries = products.map((x:string):{} => ({
      orderId,
      productId: x,
    }));

    const { error: bulkCreateError, orderItems } = await bulkCreateOrderItems(queries);

    if (bulkCreateError || !orderItems) {
      return next(bulkCreateError);
    }

    return res.json({
      message: 'Successful Order',
      orderItems,
    });
  }];

const orderDetail = [
  idValidationMiddleware('orderId'),
  async (req : Request, res : Response, next: NextFunction) => {
    const { orderId } = req.params;
    const customerId = res.locals.user.id;
    const orderQuery = { where: { id: orderId, userId: customerId } };
    const orderItemQuery = { where: { orderId } };

    const { error: orderItemsError, orderItems, order } = await findOrderAndOrderItems(
      orderQuery,
      orderItemQuery,
    );

    if (orderItemsError || !orderItems || !order) {
      return next(orderItemsError);
    }

    const productIds = orderItems.map((x:{ productId: string }) => x.productId);
    const productQuery = {
      where: {
        id: productIds,
      },
    };

    const { error: findProductErr, products } = await findAllProduct(productQuery);

    if (findProductErr || !products) {
      return next(findProductErr);
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
