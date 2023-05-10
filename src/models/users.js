const mongoose = require('mongoose');
// const CompanyModel = require('./companies');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: false,
    },
    profilePic: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

const userModel = mongoose.model('User', UserSchema);

module.exports = userModel;
