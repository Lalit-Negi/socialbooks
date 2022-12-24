const multer = require("multer");
const storage = require("../../middlewares/multer");
const CustomError = require("../../services/error-service");
const Post = require("../../models/post-model");

const createPost = (req, res, next) => {

	const handleCreatePost = multer({
		storage,
		limits: { fileSize: 4000000 * 10 },
	}).array("images");

	handleCreatePost(req, res, async (error) => {
		if (error) {
			return next(error);
		}

		if (!req.files) {
			return next(CustomError.createError(400, "images required!"));
		}

		const imagesPath = [];

		for (let path of req.files) {
			imagesPath.push(path.path);
		}

		let post;

		try {
			post = await new Post({
				images: imagesPath,
				caption: req.body.caption || null,
				user: req.user._id,
			}).save()
		} catch (error) {
			return next(error);
		}

		return res
			.status(201)
			.json({ message: "uploaded successfully!", newPost: post });
	});
};

module.exports = createPost;
