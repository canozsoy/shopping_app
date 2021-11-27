import { Request, Response, NextFunction } from 'express';
import { createProductValidation } from './validations/validations';
import { formatErrorValidationMessage, formatErrorDBMessage } from './helpers/format_error_message';
import CustomErrorObject from '../strategies/error_object';
import { Product } from '../models';

const createProduct = async (req:Request, res:Response, next:NextFunction) => {
  const validationResult = createProductValidation.validate(req.body, { abortEarly: false });
  if (validationResult.error) {
    const messages = formatErrorValidationMessage(validationResult.error);
    return next(new CustomErrorObject(messages, 400));
  }
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
};

const changeProduct = (req:Request, res:Response) => {
  res.sendStatus(200);
};

export default { createProduct, changeProduct };
