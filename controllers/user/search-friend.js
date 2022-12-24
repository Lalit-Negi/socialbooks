const User = require("../../models/user-model");
const CustomError = require("../../services/error-service");
const SearchDto = require("../../dtos/search-user");

const searchFriend = async (req, res, next) => {
	const { query } = req.body;

	if (query?.length <= 0) {
		return next(CustomError.createError(400, "data not found"));
	}

	let user;

	try {
		user = await User.findOne({ 
            following : { $elemMatch : { name : "manish"}}
         });
		if (!user) {
			return next(CustomError.userNotFound());
		}
	} catch (error) {
		return next(error);
	}

    console.log(user)

	// const unique = (users) => {
	// 	const userObject = {};
	// 	for (let user of users) {
	// 		userObject[user._id] = user;
	// 	}

	// 	return [...Object.values(userObject)];
	// };

	// const results = SearchDto.createDto2(
	// 	unique([...user.followers, ...user.following])		
	// );

	return res.status(200).json(user);
};

module.exports = searchFriend;
