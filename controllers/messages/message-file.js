const Chat = require("../../models/chat-model");
const Message = require("../../models/message-model");
const multer = require("multer");
const path = require("path");
const CustomError = require("../../services/error-service");

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads/messages");
	},
	filename: (req, file, cb) => {
		cb(
			null,
			`${Date.now()}-${Math.round(Math.random() * 1000000)}${path.extname(
				file.originalname
			)}`
		);
	},
});

const messageFile = (req, res, next) => {
	const handleMessage = multer({
		storage,
	}).single("file");

	handleMessage(req, res, async (err) => {
		if (err) {
			return next(err);
		}

		if (!req.file) {
			return next(CustomError.createError(400, "file not found!"));
		}

		const { recipient, media, time } = req.body;

		if (!recipient || recipient.length < 0 || !media) {
			return next(CustomError.createError(400, "incorrect data!"));
		}

		let msz;
		try {
			msz = await Message({
				sender: req.user._id,
				recipient,
				media,
				time,
				message: req.file.path,
			}).save();
			if (!msz) {
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

			return res.status(201).json({
				message: {
					media: msz.media,
					recipient: msz.recipient,
					sender: msz.sender,
					time: msz.time,
					message: `${process.env.APP_URL}/${msz.message}`,
				},
			});
		} catch (error) {
			return next(error);
		}
	});
};

module.exports = messageFile;
