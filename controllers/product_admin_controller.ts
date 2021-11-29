import { Request, Response, NextFunction } from 'express';
import {
  changeProductValidation,
  createProductValidation,
  idValidation,
} from './validations/validations';
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

const changeProduct = async (req:Request, res:Response, next: NextFunction) => {
  const { productId } = req.params;
  const idValidationResult = idValidation.validate(productId);
  if (idValidationResult.error) {
    const messages = formatErrorValidationMessage(idValidationResult.error);
    return next(new CustomErrorObject(messages, 400));
  }
  const validationResult = changeProductValidation.validate(req.body, { abortEarly: false });
  if (validationResult.error) {
    const messages = formatErrorValidationMessage(validationResult.error);
    return next(new CustomErrorObject(messages, 400));
  }

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
};

export default { createProduct, changeProduct };
