import jwt from 'jsonwebtoken';

const createJWT = (username: string):string => {
  const jwtSecret = process.env.JWT_SECRET as string;
  const jwtExpires = process.env.JWT_EXPIRES as string;
  return jwt.sign({ username }, jwtSecret, {
    expiresIn: +jwtExpires,
  });
};

const validateJWT = () => {
  console.log('asdf');
};

export {
  createJWT,
  validateJWT,
};
