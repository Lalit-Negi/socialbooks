const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
	profile: { type: String },
	isRead: { type: Boolean, default: false },
	text: { type: String, required: true },
	link: { type: "String", required: true },
	recipient: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
	createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("notification", notificationSchema);
