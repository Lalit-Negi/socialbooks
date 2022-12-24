class CustomError {
	constructor(status, message) {
		this.status = status;
		this.message = message;
	}

	static createError(status, message) {
		return new CustomError(status, message);
	}

	static userNotFound(){
		return new CustomError(404 , "user not found!")
	}

	static unAuthorized(){
		return new CustomError(401 , "unAuthorized")
	}
}

module.exports = CustomError;
