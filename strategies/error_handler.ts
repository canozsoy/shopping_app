import {
  ErrorRequestHandler, Request, Response, NextFunction,
} from 'express';

const errorHandler = (
  err : ErrorRequestHandler,
  req : Request,
  res : Response,
  next : NextFunction,
) => {
  if (res.headersSent) {
    return next(err);
  }
  return res.status(500).json({
    error: err,
  });
};

export default errorHandler;
