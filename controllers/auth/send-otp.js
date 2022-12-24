
const joi = require("joi");
const OtpService = require("../../services/otp-service")

const sendOtp = async (req, res, next) => {

	const { phone } = req.body;

	const phoneSchema = joi.object({
		phone: joi
			.string()
			.length(10)
			.pattern(/^[0-9]+$/).required(),
	});

	const { error } = phoneSchema.validate({ phone });

	if (error) return next(error);

	const otp =  await OtpService.generateOtp()

	const expires = Date.now() + 1000 * 60 * 2

	const hashData = `${phone}${otp}${expires}`

	const hashedData = await OtpService.hashOtp(hashData)

	return res.json({hash : `${hashedData}.${expires}` , otp , phone});
};

module.exports = sendOtp;
