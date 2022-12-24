const router = require("express").Router();
const searchUser = require("../controllers/user/search-user");
const updateProfile = require("../controllers/user/update-profile");
const auth = require("../middlewares/auth");
const userProfile = require("../controllers/user/user-profile");
const follow = require("../controllers/user/follow");
const unFollow = require("../controllers/user/un-follow");
const searchFriend = require("../controllers/user/search-friend");
const suggestions  = require("../controllers/user/suggestions")

router.put("/updateProfile", auth, updateProfile);
router.post("/searchuser", auth, searchUser);
router.get("/userprofile/:userId", auth, userProfile);
router.put("/follow", auth, follow);
router.put("/unfollow", auth, unFollow);
router.post("/searchfriend", auth, searchFriend);
router.post("/suggestions", auth, suggestions);

module.exports = router;
