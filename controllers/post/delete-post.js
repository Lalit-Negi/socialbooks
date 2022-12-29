const CustomError = require("../../services/error-service");
const Post = require("../../models/post-model");
const fs = require("fs");

const deletePost = async (req, res, next) => {
	const { postId } = req.query;

	if (!postId) {
		return next(CustomError.createError(400, "postId not found!"));
	}

	try {
		let data = await Post.findById(postId).select("images");
		if (!data) {
			return next(CustomError.createError(404, "post not found!"));
		}

		let removedUrl = [];

		try {
			data.images.forEach((image) => {
				removedUrl.push(image.split(`.com/`)[1]);
			});
		} catch (error) {
			return next();
		}

		try {
			removedUrl.forEach((imagePath) => {
				fs.unlink(imagePath, (err) => {
					if (err) {
						console.log(err);
					}
				});
			});
			await Post.findByIdAndDelete(postId);
		} catch (error) {
			return next();
		}
	} catch (error) {
		return next(error);
	}

	return res.status(200).json({ message: "deleted successfully" });
};

module.exports = deletePost;
