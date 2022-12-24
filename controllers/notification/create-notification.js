const Notification = require("../../models/notification-model");

const createNotification = async (req, res, next) => {
	let notification;
	try {
		notification = await Notification(req.body).save();
		if (!notification) {
			return next();
		}
	} catch (error) {
		return next(error);
	}

	return res.status(201).json({ notification });
};

module.exports = createNotification;
