const TokenService = require("../../services/token-service");
const CustomError = require("../../services/error-service");

const signOut = async (req, res, next) => {
	const { refreshToken } = req.cookies;

	try {
		const data = await TokenService.removeToken({ token: refreshToken });
		if (!data) {
			return next(CustomError.createError("something went wrong"));
		}
	} catch (error) {
		console.log(error.message);
	}

	res.clearCookie("accessToken");
	res.clearCookie("refreshToken");

	return res.status(200).json({ message: "sign out successfully" });
};

module.exports = signOut;
