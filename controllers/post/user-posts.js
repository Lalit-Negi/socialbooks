const CustomError = require("../../services/error-service");
const Post = require("../../models/post-model");

const myPosts = async (req, res, next) => {
	const { userId, skip, limit } = req.query;

	if (!userId) {
		return next(CustomError.createError(400, "userId not found!"));
	}

	try {
		const posts = await Post.find({ user: userId })
			.sort("-createdAt")
			.skip(skip)
			.limit(limit)
			.select("-__v -updatedAt")
			.populate("likes comments.userComment user", "name profile");
		if (!posts) {
			return next(CustomError.userNotFound());
		}

		return res.status(200).json({ posts: posts });
	} catch (error) {
		return next(error);
	}
};

module.exports = myPosts;
