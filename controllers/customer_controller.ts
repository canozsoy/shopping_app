import { Request, Response } from 'express';

const listAllOrders = (req : Request, res : Response) => {
  res.sendStatus(200);
};

const createOrder = (req : Request, res : Response) => {
  res.sendStatus(200);
};

const orderDetail = (req : Request, res : Response) => {
  res.sendStatus(200);
};

export default {
  listAllOrders,
  createOrder,
  orderDetail,
};
