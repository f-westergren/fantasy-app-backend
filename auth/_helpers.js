const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const comparePass = (userPassword, databasePassword) => {
	return bcrypt.compareSync(userPassword, databasePassword);
};

const createToken = (user) => {
	let payload = { username: user };
	return jwt.sign(payload, process.env.SECRET);
};

module.exports = { comparePass, createToken };

const checkToken = (req, res, next) => {
	const token = req.headers.authorization;
	try {
		if (token && token === `Bearer ${process.env.DB_TOKEN}`) {
			return next();
		} else {
			return next({ status: 401, message: "Unauthorized" });
		}
	} catch (err) {
		return next(err);
	}
};

module.exports = { checkToken, comparePass, createToken };
