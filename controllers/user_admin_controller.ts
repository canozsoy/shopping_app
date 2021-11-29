import { Request, Response, NextFunction } from 'express';
import { User } from '../models';
import { formatErrorDBMessage } from './helpers/format_error_message';
import CustomErrorObject from '../strategies/error_object';
import { adminUserValidations } from './validations/validations';
import { bodyValidationMiddleware } from './helpers/validation_middlewares';
import { generateHashedPassword } from './helpers/password_operations';
import { userCreate } from './helpers/database_requests';

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
const postUser = [
  bodyValidationMiddleware(adminUserValidations),
  async (req:Request, res: Response, next:NextFunction) => {
    const { username, password, role } = req.body;

    const { error: hashError, hashedPassword } = await generateHashedPassword(password);

    if (hashError || !hashedPassword) {
      return next(hashError);
    }

    const userQuery = {
      username,
      password: hashedPassword,
      role,
    };

    const { error: userCreateError, newUser } = await userCreate(userQuery);

    if (userCreateError || !newUser) {
      return next(userCreateError);
    }

    return res.json({
      message: 'Successfully Created',
      newUser: {
        id: newUser.id,
        username: newUser.username,
        role: newUser.role,
      },
    });
  }];

export default {
  getUsers,
  postUser,
};
