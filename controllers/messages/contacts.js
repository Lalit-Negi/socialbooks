const Chat = require("../../models/chat-model");

const contacts = async (req, res, next) => {
	try {
		const contacts = await Chat.find({ user: req.user._id }).select("-messages -__v -user").populate([
			{
				path : "lastMessage",
				select : "-__v"				
			},
			{
				path : "recipient",
				select : "name profile"
			}
		])
		return res.status(200).json({ message: "success", contacts });
	} catch (error) {
		return next(error);
	}
};

module.exports = contacts;
