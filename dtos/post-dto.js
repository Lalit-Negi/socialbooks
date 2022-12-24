
class PostDto {
	static createDto(posts) {
		let myPosts = [];
		for (let post of posts) {
			let images = [];
			for (let image of post.images) {
				images.push(`${process.env.APP_URL}/${image}`);
			}
			myPosts.push({
				...post,
				images,
			});
			images.length = 0;
		}
		return myPosts;
	}
}

module.exports = PostDto;
