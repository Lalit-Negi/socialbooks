const User = require("../../models/user-model");
const CustomError = require("../../services/error-service");
const joi = require("joi");
const jimp = require("jimp");
const UserDto = require("../../dtos/user-dto");

const updateProfile = async (req, res, next) => {
	const { name, bio, profile } = req.body;

	const userSchema = joi.object({
		name: joi.string().min(3).max(20).optional(),
		bio: joi.string().min(0).max(100).optional(),
		profile: joi.string().optional(),
	});

	let data = {};
	if (profile) {
		data.profile = profile;
	}
	if (name) {
		data.name = name;
	}
	if (bio) {
		data.bio = bio;
	}

	const { error } = userSchema.validate(data);
	if (error) {
		return next(error);
	}

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
			const jimpImage = await jimp.read(image);
			jimpImage.resize(150, jimp.AUTO).write(`${app}/${imagePath}`);
		} catch (error) {
			return next(error);
		}
	}

	let user;

	try {
		user = await User.findByIdAndUpdate(
			req.user._id,
			{
				$set: {
					...data,
					...(profile && { profile: imagePath }),
				},
			},
			{ new: true }
		)
			.select("-password -__v -updatedAt -createdAt")
			.populate("followers following", "name profile");
		if (!user) {
			return next(CustomError.userNotFound());
		}
	} catch (error) {
		return next(error);
	}

	return res.status(201).json({ message: "profile updated!", user });
};

module.exports = updateProfile;
