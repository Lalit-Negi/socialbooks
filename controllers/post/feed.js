const CustomError = require("../../services/error-service");
const Post = require("./../../models/post-model");
const User = require("../../models/user-model");

const feed = async (req, res, next) => {
	let user;

	const { limit, skip } = req.query;

	try {
		user = await User.findById(req.user._id).select("following -_id");
		if (!user) {
			return next(CustomError.userNotFound());
		}
	} catch (error) {
		return next(error);
	}

	let posts;

	try {
		posts = await Post.find({
			user: { $in: [req.user._id, ...user.following] },
		})
			.select("-updatedAt -__v")
			.sort("-createdAt")
			.skip(skip)
			.limit(limit)
			.populate([
				{
					path: "likes",
					select: "profile name",
				},
				{
					path: "comments.userComment",
					select: "profile name",
				},
				{
					path: "user",
					select: "name profile",
				},
			]);
	} catch (error) {
		return next(error);
	}
	return res.status(200).json({ feed: posts });
};

module.exports = feed;
