class SearchDto {
	constructor(user) {
		this.name = user.name;
		this.profile = user.profile
			? `${process.env.APP_URL}/${user.profile}`
			: null;
		this._id = user._id;
	}

	static createDto(users) {
		let searchedUsers = [];
		for (let user of users) {
			searchedUsers.push(new SearchDto(user));
		}
		return {results : searchedUsers }
	}
}

module.exports = SearchDto