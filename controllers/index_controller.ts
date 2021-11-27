import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import signupValidations from './validations/validations';
import { formatErrorValidationMessage, formatErrorDBMessage } from './helpers/format_error_message';
import { User } from '../models';
import CustomErrorObject from '../strategies/error_object';
import { createJWT } from '../strategies/jwt';

const loginPost = (req : Request, res : Response) => {
  res.sendStatus(200);
};

const signupPost = async (req : Request, res : Response, next: NextFunction) => {
  const validationResult = signupValidations.validate(req.body, { abortEarly: false });
  if (validationResult.error) {
    const { error } = validationResult;
    const messages = formatErrorValidationMessage(error);
    const errObj = new CustomErrorObject(messages, 400);
    return next(errObj);
  }

  const { username, password } = req.body;
  let hashedPassword;
  try {
    const hashSalt = process.env.SALT as string;
    hashedPassword = await bcrypt.hash(password, +hashSalt);
  } catch (err) {
    const errorObj = new CustomErrorObject({ err }, 500);
    return next(errorObj);
  }
  let newUser;
  try {
    newUser = await User.create({
      username,
      password: hashedPassword,
    });
  } catch (err) {
    const messages = formatErrorDBMessage(err);
    const errorObj = new CustomErrorObject(messages, 400);
    return next(errorObj);
  }

  const token = createJWT(username);

  return res.json({
    message: 'Successfully Created',
    newUser: {
      id: newUser?.id,
      username: newUser.username,
      jwt: token,
    },
  });
};

export default {
  loginPost,
  signupPost,
};
