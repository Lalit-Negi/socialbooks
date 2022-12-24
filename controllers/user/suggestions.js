const User = require("../../models/user-model");
const CustomError = require("../../services/error-service")

const suggestions = async (req, res, next) => {
	const { alreadySeen } = req.body;

	if(!Array.isArray(alreadySeen)){
		return next(CustomError.createError(400 , "sent data is incorrect data"))
	}

	try {
		const users = await User.find({
			_id: { $nin: [req.user._id, ...alreadySeen] },
		}).select("name profile").limit(10)
		return res.status(200).json({ message: "success", users });
	} catch (error) {
		return next(error);
	}
};

module.exports = suggestions;
