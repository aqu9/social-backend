var express = require('express');
var router = express.Router();

const {
  addUser,
  getUserList,
  getUserDeatil,
  updateUser,
} = require('../controller/users');
const { isAuthorized } = require('../middleware/auth');

router.get('/', isAuthorized, getUserList);
router.get('/user', isAuthorized, getUserDeatil);
router.post('/', addUser);
router.put('/:id', isAuthorized, updateUser);
// router.delete('/:id', deleteUser);

module.exports = router;
