const PostDto = require("../dtos/post-dto");

class UserDto {
	constructor(user) {
		this.name = user.name;
		this.phone = user.phone;
		(this.profile = user.profile
			? `${process.env.APP_URL}/${user.profile}`
			: null),
			(this.bio = user.bio || null);
		this._id = user._id;
		this.followers = UserDto.friendsDto(user.followers);
		this.following = UserDto.friendsDto(user.following);
	}

	static createDto(user) {
		return new UserDto(user);
	}

	static friendsDto(users) {
		return users.map((user) => {
			return {
				name: user.name,
				profile: `${process.env.APP_URL}/${user.profile}`,
				_id: user._id,
			};
		});
	}
}

module.exports = UserDto;
