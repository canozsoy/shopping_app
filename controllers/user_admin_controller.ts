import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models';
import { formatErrorDBMessage, formatErrorValidationMessage } from './helpers/format_error_message';
import CustomErrorObject from '../strategies/error_object';
import { adminUserValidations } from './validations/validations';

const getUsers = async (req:Request, res:Response, next: NextFunction) => {
  let users;
  try {
    users = await User.findAll();
  } catch (err) {
    const messages = formatErrorDBMessage(err);
    return next(new CustomErrorObject(messages, 500));
  }
  return res.json({
    message: 'Successfully Listed All Users',
    users,
  });
};

// Same as signup, only role can be defined, and jwt not generated
const postUser = async (req:Request, res: Response, next:NextFunction) => {
  const validationResult = adminUserValidations.validate(req.body, { abortEarly: false });
  if (validationResult.error) {
    const messages = formatErrorValidationMessage(validationResult.error);
    return next(new CustomErrorObject(messages, 400));
  }
  const { username, password, role } = req.body;
  let hashedPassword;
  try {
    const hashSalt = process.env.SALT as string;
    hashedPassword = await bcrypt.hash(password, +hashSalt);
  } catch (err) {
    return next(new CustomErrorObject({ err }, 500));
  }
  let newUser;
  try {
    newUser = await User.create({
      username,
      password: hashedPassword,
      role,
    });
  } catch (err) {
    const messages = formatErrorDBMessage(err);
    return next(new CustomErrorObject(messages, 400));
  }

  return res.json({
    message: 'Successfully Created',
    newUser: {
      id: newUser.id,
      username: newUser.username,
      role: newUser.role,
    },
  });
};

export default {
  getUsers,
  postUser,
};
