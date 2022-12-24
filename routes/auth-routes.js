const router = require("express").Router();
const auth = require("../middlewares/auth");
const sendOtp = require("../controllers/auth/send-otp");
const verifyOtp = require("../controllers/auth/verify-otp");
const signUp = require("../controllers/auth/sign-up");
const refresh = require("../middlewares/refresh");
const signIn = require("../controllers/auth/sign-in");
const changePassword = require("../controllers/auth/change-password");
const signOut = require("../controllers/auth/sign-out")

router.post("/sendotp", sendOtp);
router.post("/verifyotp", verifyOtp);
router.post("/signup", auth , signUp);
router.get("/refresh", refresh);
router.post("/signin", signIn);
router.post("/changepassword", changePassword);
router.get("/signout" , signOut)

module.exports = router;
