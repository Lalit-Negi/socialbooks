const Post = require("../../models/post-model");
const CustomError = require("../../services/error-service");

const getPost = async (req, res, next) => {
	const { postId } = req.params;

	if (!postId) {
		return next(CustomError.createError(400, "postId not found!"));
	}

	try {
		const post = await Post.findById(postId)
			.select("-__v -updatedAt")
			.populate("likes comments.userComment user", "name profile");
		if (!post) {
			return next(CustomError.createError(404, "post not found!"));
		}

		return res.status(200).json({ post });
	} catch (error) {
		return next(error);
	}
};

module.exports = getPost;
