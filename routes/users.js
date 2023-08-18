const router = require('express').Router();
const { signup, login, logout, current, uploadFile } = require("../controllers/userController");



router.route('/users/login').post(login);
router.route('/users/signup').post(signup);
router.route('/users/logout').post(logout);
router.route('/users/current').post(current);
router.route('/upload').post(uploadFile);
module.exports = router;
