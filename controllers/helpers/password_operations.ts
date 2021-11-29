import bcrypt from 'bcrypt';
import CustomErrorObject from '../../strategies/error_object';

const validatePassword = async (password:string, hashedPassword:string) => {
  let passwordValidation;
  try {
    passwordValidation = await bcrypt.compare(password, hashedPassword);
  } catch (err) {
    return { error: new CustomErrorObject([{ message: 'Internal server error' }]) };
  }
  if (!passwordValidation) {
    return { error: new CustomErrorObject([{ message: 'Incorrect username or password' }], 401) };
  }
  return { error: null };
};

const generateHashedPassword = async (password:string) => {
  let hashedPassword;
  try {
    const hashSalt = process.env.SALT as string;
    hashedPassword = await bcrypt.hash(password, +hashSalt);
  } catch (err) {
    return { error: new CustomErrorObject({ err }, 500), hashedPassword: null };
  }
  return { error: null, hashedPassword };
};

export { validatePassword, generateHashedPassword };
