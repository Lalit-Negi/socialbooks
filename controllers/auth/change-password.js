const joi = require("joi");
const User = require("../../models/user-model");
const CustomError = require("../../services/error-service");
const bcrypt = require("bcrypt");
const UserDto = require("../../dtos/user-dto");

const changePassword = async (req, res, next) => {
	const { phone, oldPassword, newPassword, newConfirmPassword } = req.body;

	const passwordSchema = joi.object({
		phone: joi.string().length(10).required(),
		oldPassword: joi.string().required(),
		newPassword: joi.string().min(6).max(20).required(),
		newConfirmPassword: joi.ref("newPassword"),
	});

	const { error } = passwordSchema.validate({
		phone,
		oldPassword,
		newPassword,
		newConfirmPassword,
	});

	if (error) return next(error);

	let user;

	try {
		user = await User.findOne({ phone });
		if (!user) return next(CustomError.userNotFound());
		else if (!user.activated) return next(CustomError.userNotFound());
	} catch (error) {
		return next(error);
	}

	const isMatched = await bcrypt.compare(oldPassword, user.password);

	if (!isMatched)
		return next(CustomError.createError(400, "wrong credentials!"));

	const encryptedPassword = await bcrypt.hash(newPassword, 10);

	try {
		await User.findOneAndUpdate(
			{ phone },
			{
				$set: {
					password: encryptedPassword,
				},
			}
		);
	} catch (error) {
		return next(error);
	}

	return res.status(200).json(UserDto.createDto(user));
};

module.exports = changePassword;
