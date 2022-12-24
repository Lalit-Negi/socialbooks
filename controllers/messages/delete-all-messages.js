const Message = require("../../models/message-model");
const Chat = require("../../models/chat-model");
const fs = require("fs");

const deleteAllMessages = async (req, res, next) => {
	const { userId } = req.params;

	let recipient;
	let user;
	let container = [];
	let container_2 = [];
	try {
		recipient = await Chat.findOne({
			$and: [{ user: userId }, { recipient: req.user._id }],
		});
	} catch (error) {
		return next(error);
	}

	try {
		user = await Chat.findOne({
			$and: [{ user: req.user._id }, { recipient: userId }],
		}).populate("messages");
	} catch (error) {
		return next(error);
	}

	user.messages.forEach((message) => {
		if (!recipient.messages.includes(message._id)) {
			container_2.push(message);
			container.push(message._id);
		}
	});

	container_2.forEach((message) => {
		if (message.media === "image" || message.media === "video") {
			fs.unlink(`${app}/${message.message}`, (err) => {
				if (err) {
					return next();
				}
			});
		}
	});

	try {
		await Message.deleteMany({ _id: { $in: container } });
	} catch (error) {
		return next(error);
	}

	try {
		await Chat.findOneAndUpdate(
			{
				$and: [{ user: req.user._id }, { recipient: userId }],
			},
			{
				messages: [],
			}
		);
		return res.status(200).json({ message: "message deleted!" });
	} catch (error) {
		return next(error);
	}
};

module.exports = deleteAllMessages;
