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

const adminUserValidations = userValidations.keys({
  role: Joi.string()
    .trim()
    .alphanum()
    .required()
    .valid('customer', 'admin'),
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

const idValidation = Joi.string().guid({
  version: [
    'uuidv4',
  ],
}).message('Id must be a valid GUID');

const changeProductValidation = createProductValidation.keys({
  name: Joi.string()
    .trim()
    .max(100),
  price: Joi.number()
    .positive(),
}).min(1)
  .messages({
    'object.min': 'Req.body must have at least 1 key',
    'object.unknown': 'ProductId must have a valid value',
  });

export {
  userValidations,
  createProductValidation,
  changeProductValidation,
  idValidation,
  adminUserValidations,
};
