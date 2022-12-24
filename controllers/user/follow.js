const User = require("../../models/user-model");
const CustomError = require("../../services/error-service");

const follow = async (req, res, next) => {
	const { id } = req.body;
	if (!id) {
		return next(CustomError.createError(422, "data not found"));
	}

	try {
		const isExists = await User.findOne({
			$and: [{ _id: req.user._id }, { following: id }],
		});
		if (isExists) {
			return next(CustomError.createError(200, "already followed"));
		}
	} catch (error) {
		return next(error);
	}

	try {
		await User.findByIdAndUpdate(
			req.user._id,
			{
				$push: {
					following: id,
				},
			}
		);
	} catch (error) {
		return next(error);
	}

	try {
		await User.findByIdAndUpdate(
			{ _id: id },
			{
				$push: { followers: req.user._id },
			}
		);
	} catch (error) {
		return next(error);
	}

	return res.status(201).json({ message: "you follow him" });
};

module.exports = follow;
