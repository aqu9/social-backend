var express = require('express');
var router = express.Router();

const userRoutes = require('./users');
const PostRoutes = require('./post');
const commentRoutes = require('./comment');
const { auth } = require('../controller/users');
const multer = require('multer');
const { uploadFile } = require('../controller/post');
const upload = multer();

router.post('/uploadImage',upload.single('image'), uploadFile);
router.use('/login', auth);
router.use('/users', userRoutes);
router.use('/post', PostRoutes);
router.use('/comment', commentRoutes);

module.exports = router;
