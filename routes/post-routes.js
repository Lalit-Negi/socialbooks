const router = require("express").Router();

const auth = require("../middlewares/auth");
const createPost = require("../controllers/post/create-post");
const userPosts = require("../controllers/post/user-posts");
const likePost = require("../controllers/post/like-post");
const feed = require("../controllers/post/feed");
const dislikePost = require("../controllers/post/dislike-post");
const explore = require("../controllers/post/explore")
const getPost = require("../controllers/post/get-post")
const deletePost = require("../controllers/post/delete-post");
const commentPost = require("../controllers/post/comment-post")

router.post("/createpost", auth, createPost);
router.get("/feed", auth, feed);
router.put("/likepost", auth, likePost);
router.put("/dislikepost", auth, dislikePost);
router.get("/userposts", auth, userPosts);
router.get("/explore", auth, explore);
router.get("/post/:postId" , auth , getPost)
router.delete("/deletepost", auth, deletePost);
router.put("/commentpost", auth, commentPost);

module.exports = router;
