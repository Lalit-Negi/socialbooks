const User = require("../../models/user-model");
const CustomError = require("../../services/error-service");
const SearchDto = require("../../dtos/search-user");

const searchUser = async (req, res, next) => {
	const { query } = req.body;

	if (query?.length <= 0) {
		return next(CustomError.createError(422, "search query is empty!"));
	}

	let results;

	try {
		results = await User.find({
			$or: [
				{ name: { $regex: `^${query}`, $options: "i" } },
				{ phone: { $regex: `^${query}` } },
			],
		})
			.limit(6)
			.select("name profile");

		if (!results) {
			return next(CustomError.userNotFound());
		}
	} catch (error) {
		return next(error);
	}

	return res.status(200).json({ results });
};

module.exports = searchUser;
