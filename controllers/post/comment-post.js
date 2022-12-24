const CustomError = require("../../services/error-service");
const Post = require("../../models/post-model");

const commentPost = async (req, res, next) => {
	const { comment, postId } = req.body;

	if (!comment) {
		return next(
			CustomError.createError(400, "comment must have atleast a character!")
		);
	}

	try {
	const data =	await Post.findByIdAndUpdate(
		    postId,
			{
				$push: {
					comments: { userComment : req.user._id , text : comment }
				},
			}
		);

		if(!data){
          return next(CustomError.createError(404 , "post not found!"))
		}
	} catch (error) {
		return next(error);
	}

	return res.status(201).json({message : "you commented on this post!"})
};

module.exports = commentPost;
