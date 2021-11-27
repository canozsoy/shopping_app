import { NextFunction, Request, Response } from 'express';
import CustomErrorObject from '../../strategies/error_object';

const verifySelf = (req:Request, res:Response, next: NextFunction) => {
  const user = res?.locals?.user;
  const { customerId } = req.params;
  if (user.id !== customerId) {
    return next(new CustomErrorObject([{ message: 'Authentication failed' }], 403));
  }
  return next();
};

export default verifySelf;
