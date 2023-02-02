const express = require("express");
const app = express();
require("dotenv").config();
const connectDb = require("./db");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path")
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
	cors: ["http://localhost:5173"],
	methods: ["GET", "POST"],
});

const socketServer = require("./socket/socket");
socketServer(io);

// gloabl
global.app = __dirname;

// middlewares
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(
	cors({
		origin: ["http://localhost:5173" , "*"],
		credentials: true,
	})
);
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// routes
app.use("/api", require("./routes/auth-routes"));
app.use("/api", require("./routes/post-routes"));
app.use("/api", require("./routes/user-routes"));
app.use("/api", require("./routes/notification-routes"));
app.use("/api", require("./routes/message-routes"));

// error handling
const errorHanlder = require("./middlewares/errorhandler");
app.use(errorHanlder);

app.use(express.static("./client/dist"))
app.get("*" , (_,res) => {
	res.sendFile(path.join(__dirname , "./client/dist/index.html"))
})

const PORT = process.env.PORT || 5000;

server.listen(PORT, async () => {
	console.log("server listening on port " + PORT);
	await connectDb();
	console.log("Connected with database successfully");
});
