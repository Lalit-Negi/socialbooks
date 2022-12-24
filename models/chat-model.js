const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user",
		index: true,
	},
	recipient: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user",
		index: true,
	},
	lastMessage: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "message",
	},
	lastSeen: { type: Date },
	messages: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "message",
		},
	],
});

module.exports = mongoose.model("chat", chatSchema);
