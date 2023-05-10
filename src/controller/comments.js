const userModel = require('../models/users');
const CommentModel = require('../models/comment');
const { postSchema } = require('../schema/post');
const { commentSchema } = require('../schema/comment');

// const { userSchema, userUpdateSchema } = require('../schema/users');
const addComment = async (req, res) => {
  try {
    console.log(req.user)
    req.body.user = req.user.userId
    const { error } = commentSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        status: 'error',
        message: error.details[0].message,
      });
    }

    // Create new comment
    const comment = new CommentModel(req.body);
    await comment.save();

    const populatedComment = await CommentModel.populate(comment, {
      path: 'user',
      model: userModel,
      select: '-password',
    });

    res.status(201).json({
    populatedComment
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};
const getCommentBypostId = async (req, res) => {
  try {
    const postId = req.params.postId;
    const comments = await CommentModel.find({ post: postId }).populate({
      path: 'user',
      select: '-password',
    }).sort({created_at: -1});
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  addComment,
  getCommentBypostId,
};
