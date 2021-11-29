import { Request, Response, NextFunction } from 'express';
import { Product } from '../models';
import { formatErrorDBMessage } from './helpers/format_error_message';
import CustomErrorObject from '../strategies/error_object';
import { idValidationMiddleware } from './helpers/validation_middlewares';

const listAllProducts = async (req : Request, res : Response, next:NextFunction) => {
  let products;
  try {
    products = await Product.findAll({ attributes: ['id'] });
  } catch (err) {
    const messages = formatErrorDBMessage(err);
    return next(new CustomErrorObject(messages));
  }
  if (!products.length) {
    return next(new CustomErrorObject([{ message: 'No product found' }], 404));
  }
  return res.json({
    message: 'Successfully Found',
    products,
  });
};

const getProduct = [
  idValidationMiddleware('id'),
  async (req : Request, res : Response, next:NextFunction) => {
    const { id } = req.params;
    let product;
    try {
      product = await Product.findOne({ where: { id } });
    } catch (err) {
      const messages = formatErrorDBMessage(err);
      return next(new CustomErrorObject(messages));
    }
    if (!product) {
      return next(new CustomErrorObject([{ message: 'Product not found' }], 404));
    }
    return res.json({
      message: 'Successfully Found',
      product,
    });
  },
];

export default {
  listAllProducts,
  getProduct,
};
