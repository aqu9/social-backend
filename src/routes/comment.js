var express = require('express');
var router = express.Router();

const { addComment, getCommentBypostId } = require('../controller/comments');
const { isAuthorized } = require('../middleware/auth');

router.get('/:postId', getCommentBypostId);
router.post('/',isAuthorized, addComment);

module.exports = router;
