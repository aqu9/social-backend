const mongoose = require('mongoose');
const userModel = require('./users');
const postModel = require('./post');

const CommentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: userModel,
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: postModel,
      required: true,
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

const CommentModel = mongoose.model('Comment', CommentSchema);

module.exports = CommentModel;
