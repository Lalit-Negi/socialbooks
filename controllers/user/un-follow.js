const CustomError = require("../../services/error-service");
const User = require("../../models/user-model");

const unFollow = async (req, res, next) => {
	const { id } = req.body;
	if (!id) {
		return next(CustomError.createError(400, "data not found"));
	}

	try {
		await User.findByIdAndUpdate(
			req.user._id,
			{
				$pull: {
					following: id,
				},
			}
		);
	} catch (error) {
		return next(error);
	}

	try {
		await User.findByIdAndUpdate(
			id,
			{
				$pull: {
					followers: req.user._id,
				},
			}
		);
	} catch (error) {
		return next(error);
	}

	return res.status(200).json({ message: "you unfollowed him" });
};

module.exports = unFollow;
