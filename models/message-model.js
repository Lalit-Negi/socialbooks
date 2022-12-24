const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
	sender: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user",
		required: true,
	},
	recipient: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user",
		required: true,
	},
	media: { type: String, required: true },
	message: { type: String, required: true },
	time: { type: Date, default: Date.now },
});

module.exports = mongoose.model("message", messageSchema);
