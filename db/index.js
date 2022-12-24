const mongoose = require("mongoose");

const connectDb = async () => {
	mongoose.set("strictQuery" , false)
	await mongoose.connect(process.env.MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
};

module.exports = connectDb;
