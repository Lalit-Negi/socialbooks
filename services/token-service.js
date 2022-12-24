const jwt = require("jsonwebtoken");
const tokenModel = require("../models/token-model");

const ACCESS_KEY = process.env.ACCESS_KEY;
const REFRESH_KEY = process.env.REFRESH_KEY;

class TokenService {
	static async generateTokens(payload) {
		const accessToken = await jwt.sign(payload, ACCESS_KEY, {
			expiresIn: "10m",
		});
		const refreshToken = await jwt.sign(payload, REFRESH_KEY, {
			expiresIn: "1y",
		});

		try {
			await tokenModel.create({ token: refreshToken });
		} catch (error) {
			return next(error);
		}

		return { accessToken, refreshToken };
	}

	static async verifyAccessToken(token) {
		return await jwt.verify(token, ACCESS_KEY);
	}

	static async verifyRefreshToken(token) {
		return await jwt.verify(token, REFRESH_KEY);
	}

	static async findToken(filter) {
		return await tokenModel.findOne(filter);
	}

	static async removeToken(filter) {
		return await tokenModel.deleteOne(filter);
	}
}

module.exports = TokenService;
