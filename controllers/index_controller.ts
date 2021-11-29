import { Request, Response, NextFunction } from 'express';
import { userValidations } from './validations/validations';
import { createJWT } from '../strategies/jwt';
import { bodyValidationMiddleware } from './helpers/validation_middlewares';
import { findUser, userCreate } from './helpers/database_requests';
import { validatePassword, generateHashedPassword } from './helpers/password_operations';

const loginPost = [
  bodyValidationMiddleware(userValidations),

  async (req : Request, res : Response, next: NextFunction) => {
    const { username, password } = req.body;
    const userQuery = {
      where: { username },
    };

    const { error: userFindError, currentUser } = await findUser(userQuery);
    if (userFindError || !currentUser) {
      return next(userFindError);
    }

    const { error: passwordError } = await validatePassword(password, currentUser.password);

    if (passwordError) {
      return next(passwordError);
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
  }];

const signupPost = [
  bodyValidationMiddleware(userValidations),
  async (req : Request, res : Response, next: NextFunction) => {
    const { username, password } = req.body;

    const { error: hashError, hashedPassword } = await generateHashedPassword(password);

    if (hashError || !hashedPassword) {
      return next(hashError);
    }

    const createQuery = {
      username,
      password: hashedPassword,
    };

    const { error: userCreateError, newUser } = await userCreate(createQuery);

    if (userCreateError || !newUser) {
      return next(userCreateError);
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
  },
];

export default {
  loginPost,
  signupPost,
};
