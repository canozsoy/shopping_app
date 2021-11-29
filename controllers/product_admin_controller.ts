import { Request, Response, NextFunction } from 'express';
import { changeProductValidation, createProductValidation } from './validations/validations';
import { formatErrorDBMessage } from './helpers/format_error_message';
import CustomErrorObject from '../strategies/error_object';
import { Product } from '../models';
import { idValidationMiddleware, bodyValidationMiddleware } from './helpers/validation_middlewares';

const createProduct = [
  bodyValidationMiddleware(createProductValidation),
  async (req:Request, res:Response, next:NextFunction) => {
    const { name, price, detail } = req.body;
    let newProduct;
    try {
      newProduct = await Product.create({ name, price, detail });
    } catch (err) {
      const messages = formatErrorDBMessage(err);
      return next(new CustomErrorObject(messages));
    }

    return res.json({
      message: 'Successfully Created',
      newProduct,
    });
  },
];

const changeProduct = [
  idValidationMiddleware('productId'),
  bodyValidationMiddleware(changeProductValidation),
  async (req:Request, res:Response, next: NextFunction) => {
    const { productId } = req.params;
    let updatedProduct;
    try {
      updatedProduct = await Product.update(
        req.body,
        { where: { id: productId }, returning: true },
      );
    } catch (err) {
      const messages = formatErrorDBMessage(err);
      return next(new CustomErrorObject(messages));
    }
    const [number, item] = updatedProduct;
    if (!number) {
      return next(new CustomErrorObject([{ message: 'ProductId not Found' }], 404));
    }
    return res.json({
      message: 'Successfully Updated',
      updatedProduct: item[0],
    });
  },
];

export default { createProduct, changeProduct };
