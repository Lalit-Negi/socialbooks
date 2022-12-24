const router = require("express").Router();
const createNotification = require("../controllers/notification/create-notification");
const auth = require("../middlewares/auth");

router.post("/createNotification", auth, createNotification);

module.exports = router;
