const CustomError = require("../services/error-service");
const TokenService = require("../services/token-service");
const User = require("../models/user-model");

const auth = async (req, res, next) => {
	const { accessToken } = req.cookies;

	try {
		const user = await TokenService.verifyAccessToken(accessToken);
		let isExist = await User.findById(user._id);
		if (!isExist) {
			return next(CustomError.unAuthorized());
		}
		req.user = user;
		next();
	} catch (error) {
		return next(CustomError.unAuthorized());
	}
};

module.exports = auth;
