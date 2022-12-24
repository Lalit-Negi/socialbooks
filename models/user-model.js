const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		phone: {
			type: String,
			required: true,
			index: true,
		},
		activated: {
			type: Boolean,
			default: false,
		},
		name: {
			type: String,
			trim: true,
			index: true,
		},
		profile: {
			type: String,
			get : (profile) => `${process.env.APP_URL}/${profile}`
		},
		password: {
			type: String,
		},
		bio: {
			type: String,
			trim: true,
		},
		followers: {
			type: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
		},
		following: {
			type: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
		},
		blacklist: {
			type: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
		},
	},
	{
		timestamps: true,  toJSON : { getters : true}
	}
);

module.exports = mongoose.model("user", userSchema);
