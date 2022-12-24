const joi = require("joi");
const CustomError = require("../../services/error-service");
const OtpService = require("../../services/otp-service");
const TokenService = require("../../services/token-service");
const User = require("../..//models/user-model");

const tokens = async (user, res) => {
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

	return res.status(201).json({ auth: true });
};

const verifyOtp = async (req, res, next) => {
	const { phone, otp, hash } = req.body;

	const verifySchema = joi.object({
		phone: joi
			.string()
			.length(10)
			.pattern(/^[0-9]+$/)
			.required(),
		otp: joi.required(),
		hash: joi.string().required(),
	});

	const { error } = verifySchema.validate({ phone, otp, hash });

	if (error) return next(error);

	const expiresTime = hash.split(".")[1];

	if (Date.now() > expiresTime)
		return next(CustomError.createError(400, "otp expired!"));

	const hashData = `${phone}${otp}${expiresTime}`;

	const isMatched = await OtpService.verifyOtp(hashData, hash.split(".")[0]);

	if (!isMatched) return next(CustomError.createError(400, "wrong otp!"));

	let userExist;

	try {
		userExist = await User.findOne({ phone });
		if (userExist && userExist.activated)
			return next(
				CustomError.createError(400, "user already exists!. please signIn")
			);
	} catch (error) {
		return next(error);
	}

	if (userExist) {
		tokens(userExist, res);
	} else {
		try {
			user = await User({ phone }).save();
			tokens(user, res);
		} catch (error) {
			return next(error);
		}
	}
};

module.exports = verifyOtp;
