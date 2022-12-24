const Post = require("../../models/post-model");
const CustomError = require("../../services/error-service");

const dislikePost = async (req, res, next) => {
	const { postId } = req.body;

	try {
		const data = await Post.findByIdAndUpdate(postId, {
			$pull: { likes: req.user._id },
		});
		if (data) {
			return res.status(200).json({ message: "you unliked this post!" });
		} else {
			return next(CustomError.createError(404, "post not found!"));
		}
	} catch (error) {
		return next(error);
	}
};

module.exports = dislikePost;
