const userModel = require('../models/users');
const PostModel = require('../models/post');
const { postSchema } = require('../schema/post');
const FileModel = require('../models/files');

// const { userSchema, userUpdateSchema } = require('../schema/users');
const addPost = async (req, res) => {
  try {
    // Validate the request body using Joi
    const { error, value } = postSchema.validate(req.body);
    if (error) {
      throw new Error(error.details[0].message);
    }
    // Check if the user exists
    const user = await userModel.findById(req.user.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Create a new Post instance with the validated data
    const post = new PostModel({
      description: value.description,
      postImage: value.postImage,
      user: req.user.userId,
    });

    // Save the post to the database
    await post.save();

    // Return the saved post as the response
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const allPost = async (req, res) => {
  try {
    const posts = await PostModel.find().populate({
      path: 'user',
      select: '-password',
    }).sort({created_at: -1});
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
const getPostByID = async (req, res) => {
  const { id, user } = req.query;

  const searchParams = {};

  if (id) {
    searchParams._id = id;
  }

  if (user) {
    searchParams.user = user;
  }

  try {
    const posts = await PostModel.find(searchParams).populate({
      path: 'user',
      select: '-password',
    }).sort({created_at: -1});
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
const getPostByUserID = async (req, res) => {
  const { id, user } = req.query;

  const searchParams = {};
  console.log(req.user.userId)

  if (id) {
    searchParams.user = req.user.userId;
  }

  try {
    const posts = await PostModel.find(searchParams).populate({
      path: 'user',
      select: '-password',
    }).sort({created_at: -1});
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const uploadFile = async (req, res) => {
  try {
    
    const File = new FileModel({
      file: req.file ? req.file.buffer : undefined,
    });
    const base64String = Buffer.from(req.file.buffer).toString('base64');
    File.url = `data:image/jpeg;base64,${base64String}`
    await File.save();
     res.json({url:`data:image/jpeg;base64,${base64String}`})
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: 'Server error', error:error });    
  }
  

};

const searchPost = async (req, res) => {
  try {
    const name = req.query.name;  
    const regexPattern = new RegExp(name, 'i')

const data =await  PostModel.aggregate([
  {
    $lookup: {
      from: 'users', // Replace with the name of the users collection
      localField: 'user',
      foreignField: '_id',
      as: 'user',
    },
  },
  {
    $match: {
      'user.name': { $regex: regexPattern },
    },
    
  },
  {
    $addFields: {
      user: { $arrayElemAt: ['$user', 0] },
    },
  },
  {
    $sort: {
      created_at: -1, // Sort in descending order based on the createdAt field
    },
  }
])
  .exec();
  // if(data.user.length){

  //   data.user = data.user[0]
  // }
  res.json(data);
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  addPost,
  allPost,
  getPostByID,
  uploadFile,
  getPostByUserID,
  searchPost
};
