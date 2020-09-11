const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = async (data) => {
	const token = await jwt.sign({ ...data }, process.env.JWT_SECRET_KEY, { expiresIn: 2 * 60 * 60 });
	return token;
};

module.exports = generateToken;
