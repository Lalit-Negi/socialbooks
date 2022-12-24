const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
	{
		images: {
			type: Array,
			required: true,
			get: (images) => {
				return images.map((image) => `${process.env.APP_URL}/${image}`);
			},
		},
		caption: { type: String, trim: true },
		likes: {
			type: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
		},
		comments: {
			type: [
				{
					userComment: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
					text: { type: String, trim: true },
					createdAt: { type: Date, default: Date.now },
				},
			],
		},
		user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
	},
	{
		timestamps: true,
		toJSON: { getters: true },
	}
);

module.exports = mongoose.model("post", postSchema);
