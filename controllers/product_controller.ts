import { Request, Response } from 'express';

const listAllProducts = (req : Request, res : Response) => {
  res.sendStatus(200);
};

const createProduct = (req : Request, res : Response) => {
  res.sendStatus(200);
};

const getProduct = (req : Request, res : Response) => {
  res.sendStatus(200);
};

const changeProduct = (req : Request, res : Response) => {
  res.sendStatus(200);
};

export default {
  listAllProducts,
  createProduct,
  getProduct,
  changeProduct,
};
