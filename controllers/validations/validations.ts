import Joi from 'joi';

const userValidations = Joi.object({
  username: Joi.string()
    .trim()
    .alphanum()
    .min(3)
    .max(30)
    .required(),
  password: Joi.string()
    .trim()
    .alphanum()
    .min(3)
    .max(15)
    .required(),
});

export default userValidations;
