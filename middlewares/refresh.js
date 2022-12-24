const TokenService = require("../services/token-service");
const User = require("../models/user-model");
const CustomError = require("../services/error-service");

const refresh = async (req, res, next) => {
	const { refreshToken } = req.cookies;

	try {
		const user = await TokenService.verifyRefreshToken(refreshToken);
		const isExist = await TokenService.findToken({ token: refreshToken });

		const tokens = async () => {
			const { accessToken, refreshToken } = await TokenService.generateTokens({
				_id: user._id,
			});

			res.cookie("accessToken", accessToken, {
				httpOnly: true,
				maxAge: 1000 * 60 * 60,
				secure: true,
			});

			res.cookie("refreshToken", refreshToken, {
				httpOnly: true,
				maxAge: 1000 * 60 * 60 * 24 * 30 * 12,
				secure: true,
			});
		};

		try {
			const userExists = await User.findById( user._id ).select("-blacklist -__v -updatedAt -createdAt -password").populate("followers following" , "name profile")
			if (userExists && isExist) {
				if (userExists.activated) {
					await tokens();
					return res
						.status(201)
						.json({ refresh: true, user: userExists });
				}
				await tokens();
				return res.status(201).json({ refresh: true });
			} else {
				res.clearCookie("accessToken");
				res.clearCookie("refreshToken");
				return next(CustomError.userNotFound());
			}
		} catch (error) {
			return next(CustomError.unAuthorized());
		}
	} catch (error) {
		return next(error);
	}
};

module.exports = refresh;
