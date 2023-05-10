const Joi = require('joi');

const userSchema = Joi.object({
  name: Joi.string().required(),
  userId: Joi.string(),
  profilePic: Joi.string(),
  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const userUpdateSchema = Joi.object({
  name: Joi.string(),
  userId: Joi.string(),
  profilePic: Joi.string(),
  phone: Joi.string().pattern(/^[0-9]{10}$/),
  email: Joi.string().email(),
  password: Joi.string(),
});

const LoginSchema = Joi.object({
  userId: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports = {
  userSchema,
  userUpdateSchema,
  LoginSchema,
};
