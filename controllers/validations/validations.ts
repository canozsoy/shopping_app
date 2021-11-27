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

const createProductValidation = Joi.object({
  name: Joi.string()
    .trim()
    .max(100)
    .required(),
  price: Joi.number()
    .positive()
    .required(),
  detail: Joi.string()
    .trim(),
});

export {
  userValidations,
  createProductValidation,
};
