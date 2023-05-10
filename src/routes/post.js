var express = require('express');
var router = express.Router();

const { addPost, allPost, getPostByID, getPostByUserID, searchPost } = require('../controller/post');
const { isAuthorized } = require('../middleware/auth');

router.get('/', allPost);
router.post('/',isAuthorized, addPost);
router.get('/postbyId', getPostByID);
router.get('/search', searchPost);
router.get('/postbyUserId',isAuthorized, getPostByUserID);

module.exports = router;
