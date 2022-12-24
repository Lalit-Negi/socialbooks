const jimp = require("jimp");
const joi = require("joi");
const CustomError = require("../../services/error-service");
const User = require("../../models/user-model");
const bcrypt = require("bcrypt");

const signUp = async (req, res, next) => {
	const { name, profile, password, confirmPassword, bio } = req.body;

	const profileSchema = joi.object({
		name: joi.string().min(3).max(20).required(),
		profile: joi.string().optional(),
		password: joi.string().min(6).max(20).required(),
		confirmPassword: joi.ref("password"),
		bio: joi.string().optional().max(100).min(0),
	});

	const { error } = profileSchema.validate({
		name,
		profile,
		password,
		confirmPassword,
		bio,
	});

	if (error) return next(error);

	let user;
	try {
		user = await User.findById(req.user._id);
		if (user && !user.activated) {
			let imagePath;
			if (profile) {
				let image;
				try {
					image = Buffer.from(
						profile.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
						"base64"
					);
				} catch (error) {
					return next(error);
				}

				imagePath = `uploads/profiles/${Date.now()}-${Math.round(
					Math.random() * 1e9
				)}.png`;

				try {
					const jimpRes = await jimp.read(image);
					jimpRes.resize(150, jimp.AUTO).write(`${app}/${imagePath}`);
				} catch (error) {
					return next(error);
				}
			}

			const encryptedPassword = await bcrypt.hash(password, 10);

			let user;
			try {
				user = await User.findOneAndUpdate(
					{ _id: req.user._id },
					{
						$set: {
							name,
							profile: imagePath || null,
							activated: true,
							password: encryptedPassword,
							bio: bio || null,
						},
					},
					{
						new: true,
					}
				).select("-__v -createdAt -updatedAt -blacklist -password").populate("followers following" , "name profile")
			} catch (error) {
				return next(error);
			}
		
			return res.status(201).json(user);
		} else if (user && user.activated) {
			return next(
				CustomError.createError(400, "already activated! please signIn")
			);
		} else {
			return next(CustomError.userNotFound());
		}
	} catch (error) {
		return next(error);
	}
};

module.exports = signUp;
