const errorHandler = (err, req, res, next) => {
	const DEBUG_MODE = true;
	const statusCode = err.status || 500;
	const error = DEBUG_MODE
		? { originalError: err.message }
		: { message: "Internal Error" };

	return res.status(statusCode).json(error);
};

module.exports = errorHandler;
