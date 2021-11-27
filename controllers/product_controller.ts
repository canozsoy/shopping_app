import { Request, Response } from 'express';

const listAllProducts = (req : Request, res : Response) => {
  res.sendStatus(200);
};

const getProduct = (req : Request, res : Response) => {
  res.sendStatus(200);
};

export default {
  listAllProducts,
  getProduct,
};
