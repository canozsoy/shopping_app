import { Request, Response } from 'express';
import signupValidations from './validations/validations';
import formatErrorMessage from './helpers/format_error_message';

const loginPost = (req : Request, res : Response) => {
  res.sendStatus(200);
};

const signupPost = (req : Request, res : Response) => {
  const validationResult = signupValidations.validate(req.body, { abortEarly: false });
  if (validationResult.error) {
    const { error } = validationResult;
    const messages = formatErrorMessage(error);
    return res.json({
      error: messages,
    });
  }
  return res.sendStatus(200);
};

export default {
  loginPost,
  signupPost,
};
