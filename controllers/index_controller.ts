import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { userValidations } from './validations/validations';
import { formatErrorValidationMessage, formatErrorDBMessage } from './helpers/format_error_message';
import { User } from '../models';
import CustomErrorObject from '../strategies/error_object';
import { createJWT } from '../strategies/jwt';

const loginPost = async (req : Request, res : Response, next: NextFunction) => {
  const validationResult = userValidations.validate(req.body, { abortEarly: false });

  if (validationResult.error) {
    const { error } = validationResult;
    const messages = formatErrorValidationMessage(error);
    const errorObj = new CustomErrorObject(messages, 400);
    return next(errorObj);
  }

  const { username, password } = req.body;
  let currentUser;
  try {
    currentUser = await User.findOne({ where: { username } });
  } catch (err) {
    const messages = formatErrorDBMessage(err);
    return next(new CustomErrorObject(messages));
  }
  if (!currentUser) {
    return next(new CustomErrorObject([{ message: 'Incorrect username or password' }], 401));
  }

  let passwordValidation;
  try {
    passwordValidation = await bcrypt.compare(password, currentUser.password);
  } catch (err) {
    return next(new CustomErrorObject([{ message: 'Internal server error' }]));
  }
  if (!passwordValidation) {
    return next(new CustomErrorObject([{ message: 'Incorrect username or password' }], 401));
  }

  const token = createJWT(currentUser.id, username, currentUser.role);
  return res.json({
    message: 'Successfully Logged In',
    currentUser: {
      id: currentUser.id,
      username: currentUser.username,
      role: currentUser.role,
      jwt: token,
    },

  });
};

const signupPost = async (req : Request, res : Response, next: NextFunction) => {
  const validationResult = userValidations.validate(req.body, { abortEarly: false });
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

  const token = createJWT(newUser.id, username, newUser.role);

  return res.json({
    message: 'Successfully Created',
    newUser: {
      id: newUser?.id,
      username: newUser.username,
      role: newUser.role,
      jwt: token,
    },
  });
};

export default {
  loginPost,
  signupPost,
};
