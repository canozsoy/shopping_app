import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';
import { idValidation } from '../validations/validations';
import { formatErrorValidationMessage } from './format_error_message';
import CustomErrorObject from '../../strategies/error_object';

const idValidationMiddleware = (id:string) => (req:Request, res:Response, next:NextFunction) => {
  const idValidationResult = idValidation.validate(req.params[id]);
  if (idValidationResult.error) {
    const messages = formatErrorValidationMessage(idValidationResult.error);
    return next(new CustomErrorObject(messages, 400));
  }
  return next();
};

const bodyValidationMiddleware = function (validationType: ObjectSchema) {
  return (req:Request, res:Response, next:NextFunction) => {
    const bodyValidationResult = validationType.validate(req.body, { abortEarly: false });
    if (bodyValidationResult.error) {
      const messages = formatErrorValidationMessage(bodyValidationResult.error);
      return next(new CustomErrorObject(messages, 400));
    }
    return next();
  };
};

export { idValidationMiddleware, bodyValidationMiddleware };
