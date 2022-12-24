const Chat = require("../../models/chat-model");

const messages = async (req, res, next) => {
	const { userId } = req.params;

	try {
		const messages = await Chat.findOne({
			$and: [{ user: req.user._id }, { recipient: userId }],
		})
			.select("messages")
			.populate({
				path: "messages",
				select: "-__v",
			});

		messages.messages.map((msz) => {
			if (msz.media === "image" || msz.media === "video") {
				msz.message = `${process.env.APP_URL}/${msz.message}`;
			}
		});

		return res
			.status(200)
			.json({ message: "success", messages: messages.messages || [] });
	} catch (error) {
		return next(error);
	}
};

module.exports = messages;
