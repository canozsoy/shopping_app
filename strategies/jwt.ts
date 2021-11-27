import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import CustomErrorObject from './error_object';

const createJWT = (id:string, username: string, role:string):string => {
  const jwtSecret = process.env.JWT_SECRET as string;
  const jwtExpires = process.env.JWT_EXPIRES as string;
  return jwt.sign({ id, username, role }, jwtSecret, {
    expiresIn: +jwtExpires,
  });
};

const extractJWTFromBearerToken = (req: Request):string | null => {
  const bearerToken = req.headers.authorization;
  if (!bearerToken || !bearerToken.includes('Bearer ')) {
    return null;
  }
  return bearerToken.replace('Bearer ', '');
};

const verifyJWT = async (req: Request, res: Response, next:NextFunction) => {
  const token = extractJWTFromBearerToken(req);
  if (!token) {
    return next(new CustomErrorObject([{ message: 'Authentication failed' }], 401));
  }
  let payload;
  const jwtSecret = process.env.JWT_SECRET as string;
  try {
    payload = await jwt.verify(token, jwtSecret);
  } catch (err) {
    return next(new CustomErrorObject([{ message: 'Authentication failed' }], 401));
  }
  payload = payload as object;
  res.locals = {
    user: payload,
  };
  return next();
};

const adminVerifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const user = res?.locals?.user;
  if (user.role !== 'admin') {
    return next(new CustomErrorObject([{ message: 'Authentication failed' }], 403));
  }
  return next();
};

export {
  createJWT,
  verifyJWT,
  extractJWTFromBearerToken,
  adminVerifyJWT,
};
