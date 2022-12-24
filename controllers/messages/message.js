const Message = require("../../models/message-model");
const Chat = require("../../models/chat-model");
const CustomError = require("../../services/error-service");

const message = async (req, res, next) => {
	const { recipient, message } = req.body;

	if (!recipient || recipient.length < 0 || !message) {
		return next(CustomError.createError(400, "incorrect data!"));
	}

	let msz;
	try {
		msz = await Message(message).save();
		if (!message) {
			return next();
		}
	} catch (error) {
		return next(error);
	}

	try {
		await Chat.findOneAndUpdate(
			{ $and: [{ user: req.user._id }, { recipient }] },
			{
				lastMessage: msz._id,
				$push: {
					messages: msz._id,
				},
			},
			{ upsert: true }
		);

		await Chat.findOneAndUpdate(
			{
				$and: [
					{
						user: recipient,
					},
					{
						recipient: req.user._id,
					},
				],
			},
			{
				lastMessage: msz._id,
				$push: {
					messages: msz._id,
				},
			},
			{ upsert: true }
		);

		return res.status(201).json({ message: "message has created!" });
	} catch (error) {
		return next(error);
	}
};

module.exports = message;
