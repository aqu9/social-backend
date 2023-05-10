const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
// const { customResponse, customPagination } = require('../utility/helper');
const bcrypt = require('bcrypt');

const userModel = require('../models/users');
const { nanoid } = require('nanoid');
const {
  userSchema,
  userUpdateSchema,
  LoginSchema,
} = require('../schema/users');

const getUserList = async (req, res) => {
  try {
    const { s } = req.query;
    const regex = new RegExp(s, 'i');
    const searchParams = {
      $or: [{ name: regex }, { userId: regex }],
    };
    const users = await userModel.find(searchParams).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserDeatil = async (req, res) => {
  const _id = req.user.id;
  try {
    const users = await userModel.findById(_id).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addUser = async (req, res) => {
  try {
    // Validate request body against Joi schema
    const { error } = userSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Check if user with given email or phone already exists
    const existingUser = await userModel.findOne({
      $or: [{ email: req.body.email }, { phone: req.body.phone }],
    });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;

    const newUser = new userModel(req.body);
    newUser.userId = newUser.phone.slice(-3)+"-"+newUser.name.slice(0, 3)+"-"+newUser.phone.slice(0,3)
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { error: validationError } = userUpdateSchema.validate(req.body);

  if (validationError) {
    return res
      .status(400)
      .json({ message: validationError.details[0].message });
  }

  try {
    const user = await userModel
      .findOneAndUpdate({ _id: id }, { $set: { ...req.body } }, { new: true })
      .select('-password');

    if (!user) {
      return res
        .status(404)
        .json({ message: `User with userId ${id} not found` });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const auth = async (req, res) => {
  try {
    // Validate request body against schema
    const { error, value } = LoginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Check if the user exists
    const user = await userModel.findOne({
      $or: [
        { email: value.userId },
        { phone: value.userId },
        { userId: value.userId },
      ],
    });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(value.password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate and return a JWT access token
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    return res
      .status(200)
      .json({ accessToken, refreshToken, userId: user._id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  addUser,
  getUserList,
  getUserDeatil,
  updateUser,
  auth,
};
