import { Request, Response } from 'express';

const loginPost = (req : Request, res : Response) => {
  res.sendStatus(200);
};

const signupPost = (req : Request, res : Response) => {
  res.sendStatus(200);
};

export default {
  loginPost,
  signupPost,
};
