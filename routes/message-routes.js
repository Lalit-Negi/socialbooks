const router = require("express").Router();
const auth = require("../middlewares/auth");
const message = require("../controllers/messages/message");
const contacts = require("../controllers/messages/contacts");
const messages = require("../controllers/messages/messages");
const messageFile = require("../controllers/messages/message-file");
const deleteAllMessages = require("../controllers/messages/delete-all-messages")

router.patch("/message", auth, message);
router.get("/contacts", auth, contacts);
router.get("/messages/:userId", auth, messages);
router.patch("/messagefile", auth, messageFile);
router.delete("/deleteallmessages/:userId" , auth , deleteAllMessages)

module.exports = router;
