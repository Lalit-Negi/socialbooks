const Post = require("../../models/post-model");
const CustomError = require("../../services/error-service");

const likePost = async (req, res, next) => {
	const { postId } = req.body;

	if (!postId) {
		return next(CustomError.createError(400, "postId not found!"));
	}

	try {
		const isLiked = await Post.findOne({
			_id: postId,
			likes: req.user._id,
		});
		if (isLiked) {
			return res.status(200).json({ message: "already liked!" });
		}
	} catch (error) {
		return next(error);
	}

	try {
		const data = await Post.findByIdAndUpdate(postId, {
			$push: { likes: req.user._id },
		});
		if (data) {
			return res.status(201).json({ message: "you liked this post!" });
		} else {
			return next(CustomError.createError(404, "post not found!"));
		}
	} catch (error) {
		return next(error);
	}
};

module.exports = likePost;
