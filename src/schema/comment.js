const Joi = require('joi');

const commentSchema = Joi.object({
  comment: Joi.string().required(),
  user: Joi.string().required(),
  post: Joi.string().required(),
});

module.exports = {
  commentSchema,
};
