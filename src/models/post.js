const mongoose = require('mongoose');
const userModel = require('./users');

const PostSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    postImage: {
      type: String,
      required: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: userModel,
      required: true,
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

const PostModel = mongoose.model('Post', PostSchema);

module.exports = PostModel;
