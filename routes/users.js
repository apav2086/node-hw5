const router = require("express").Router();
const {
  signup,
  login,
  logout,
  current,
  avatarUpdate,
} = require("../controllers/userController");

router.route("/login").post(login);
router.route("/signup").post(signup);
router.route("/logout").post(logout);
router.route("/current").post(current);
router.route("/avatars").patch(avatarUpdate);
// router.route('/upload').post(uploadFile);
module.exports = router;