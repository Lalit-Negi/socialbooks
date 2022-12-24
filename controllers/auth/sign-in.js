const joi = require("joi");
const User = require("../../models/user-model");
const bcrypt = require("bcrypt");
const CustomError = require("../../services/error-service");
const TokenService = require("../../services/token-service");

const signIn = async (req, res, next) => {
	const { phone, password } = req.body;

	const signInSchema = joi.object({
		phone: joi.string().length(10).required(),
		password: joi.string().required(),
	});

	const { error } = signInSchema.validate({ phone, password });

	if (error) return next(error);

	let user;

	try {
		user = await User.findOne({ phone })
			.select("-__v -createdAt -updatedAt -blacklist")
			.populate("followers following", "name profile");
		if (!user) return next(CustomError.userNotFound());

		if (!user.activated) {
			return next(CustomError.userNotFound());
		}
	} catch (error) {
		return next(error);
	}

	const isMatched = await bcrypt.compare(password, user.password);

	if (!isMatched)
		return next(CustomError.createError(404, "wrong credentials!"));

	const { accessToken, refreshToken } = await TokenService.generateTokens({
		_id: user._id,
	});

	res.cookie("accessToken", accessToken, {
		httpOnly: true,
		maxAge: 1000 * 60 * 10,
		secure: true,	
	});

	res.cookie("refreshToken", refreshToken, {
		httpOnly: true,
		maxAge: 1000 * 60 * 60 * 24 * 30 * 12,
		secure: true,		
	});

	user = {
		"_id": user._id,
		"phone": user.phone,		
		"followers": user.followers,
		"following": user.following,
		"bio": user.bio,
		"name": user.name,	
		"profile": user.profile
	}

	return res.status(200).json(user);
};

module.exports = signIn;
