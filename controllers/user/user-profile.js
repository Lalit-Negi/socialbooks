const CustomError = require("../../services/error-service");
const User = require("../../models/user-model");

const userProfile = async (req, res, next) => {
	const { userId } = req.params;

	if (!userId) {
		return next(CustomError.createError(422, "post data not found"));
	}

	let user;

	try {
		user = await User.findById(userId).select("-password -updatedAt -__v").populate("followers following" , "name profile")
		if (!user) {
			return next(CustomError.userNotFound());
		}
	} catch (error) {
		return next(error);
	}

	return res.status(200).json({ user });
};
module.exports = userProfile;
