const Chat = require("../models/chat-model");
let users = [];

const socketServer = (io) => {
	io.on("connection", (socket) => {
		socket.on("JOIN", (userId) => {
			users.push({ userId, socketId: socket.id });
		});

		socket.on("disconnect", () => {
			const me = users.filter((user) => user.socketId === socket.id);
			users.forEach((user) => {
				socket.to(user.socketId).emit("UNACTIVE", { userId: me[0]?.userId });
			});
			users = users.filter((user) => user.socketId !== socket.id);
		});

		socket.on("LIKE_POST", (data) => {
			data.friends.forEach((friend) => {
				for (let user of users) {
					if (user.userId === friend._id) {
						socket.to(user.socketId).emit("LIKE_POST", {
							postId: data.postId,
							user: data.user,
						});
						break;
					}
				}
			});
		});

		socket.on("UNLIKE_POST", (data) => {
			data.friends.forEach((friend) => {
				for (let user of users) {
					if (user.userId === friend._id) {
						socket.to(user.socketId).emit("UNLIKE_POST", {
							postId: data.postId,
							userId: data.userId,
						});
						break;
					}
				}
			});
		});

		socket.on("COMMENT_POST", (data) => {
			data.friends.forEach((friend) => {
				for (let user of users) {
					if (user.userId === friend._id) {
						socket.to(user.socketId).emit("COMMENT_POST", {
							user: data.user,
							postId: data.postId,
						});
						break;
					}
				}
			});
		});

		socket.on("ADD_POST", (data) => {
			data.friends.forEach((friend) => {
				for (let user of users) {
					if (user.userId === friend._id) {
						socket.to(user.socketId).emit("ADD_POST", {
							post: data.post,
						});
						break;
					}
				}
			});
		});

		socket.on("DELETE_POST", (data) => {
			data.friends.forEach((friend) => {
				for (let user of users) {
					if (user.userId === friend._id) {
						socket.to(user.socketId).emit("DELETE_POST", {
							postId: data.postId,
						});
						break;
					}
				}
			});
		});

		socket.on("FOLLOW", (data) => {
			for (let user of users) {
				if (user.userId === data._id) {
					socket.to(user.socketId).emit("FOLLOW", {
						user: data.user,
					});
					break;
				}
			}
		});

		socket.on("UNFOLLOW", (data) => {
			for (let user of users) {
				if (user.userId === data._id) {
					socket.to(user.socketId).emit("UNFOLLOW", {
						userId: data.userId,
					});
					break;
				}
			}
		});

		socket.on("NOTIFICATION", (data) => {
			data.recipient.forEach((id) => {
				for (let user of users) {
					if (id === user.userId) {
						socket.to(user.socketId).emit("NOTIFICATION", {
							text: data.text,
							profile: data.profile,
							link: data.link,
							_id: data._id,
							isRead: data.isRead,
							createdAt: data.createdAt,
						});
						break;
					}
				}
			});
		});

		socket.on("FOLLOW_NOTIFICATION", (data) => {
			data.recipient.forEach((id) => {
				for (let user of users) {
					if (id === user.userId) {
						socket.to(user.socketId).emit("FOLLOW_NOTIFICATION", {
							text: data.text,
							profile: data.profile,
							link: data.link,
							_id: data._id,
							isRead: data.isRead,
							createdAt: data.createdAt,
						});
						break;
					}
				}
			});
		});

		socket.on("LIKE_NOTIFICATION", (data) => {
			data.recipient.forEach((id) => {
				for (let user of users) {
					if (id === user.userId) {
						socket.to(user.socketId).emit("LIKE_NOTIFICATION", {
							text: data.text,
							profile: data.profile,
							link: data.link,
							_id: data._id,
							isRead: data.isRead,
							createdAt: data.createdAt,
						});
						break;
					}
				}
			});
		});

		socket.on("COMMENT_NOTIFICATION", (data) => {
			data.recipient.forEach((id) => {
				for (let user of users) {
					if (id === user.userId) {
						socket.to(user.socketId).emit("COMMENT_NOTIFICATION", {
							text: data.text,
							profile: data.profile,
							link: data.link,
							_id: data._id,
							isRead: data.isRead,
							createdAt: data.createdAt,
						});
						break;
					}
				}
			});
		});

		socket.on("MESSAGE", (data) => {
			for (let user of users) {
				if (user.userId === data.recipient) {
					socket.to(user.socketId).emit("MESSAGE", data);
					break;
				}
			}
		});

		socket.on("TYPING" , (data) => {
			for(let user of users){
				if(user.userId === data.userId){
					socket.to(user.socketId).emit("TYPING" , { userId : data.myId})
				}
			}
		})
	});
};

module.exports = socketServer;
