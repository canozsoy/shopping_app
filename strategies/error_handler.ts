import { Request, Response, NextFunction } from 'express';
import CustomErrorObject from './error_object';

const errorHandler = (
  err : CustomErrorObject,
  req : Request,
  res : Response,
  next : NextFunction,
) => {
  if (res.headersSent) {
    return next(err);
  }
  return res.status(err.status || 500).json({
    error: err.object,
  });
};

export default errorHandler;
