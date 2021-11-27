import { Request, Response } from 'express';

const createProduct = (req:Request, res:Response) => {
  res.sendStatus(200);
};

const changeProduct = (req:Request, res:Response) => {
  res.sendStatus(200);
};

export default { createProduct, changeProduct };
