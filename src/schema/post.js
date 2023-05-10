const Joi = require('joi');

const postSchema = Joi.object({
  description: Joi.string(),
  postImage: Joi.string(),
});

module.exports = {
  postSchema,
};
