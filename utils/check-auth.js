const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server');
require('dotenv').config();

module.exports = (context) => {
	if (context.req) {
		const authHeader = context.req.headers.authorization;
		if (authHeader) {
			const token = authHeader.split('Bearer ')[1];
			if (token) {
				try {
					const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
					return user;
				} catch (err) {
					throw new AuthenticationError('Invalid/expired token');
				}
			}
			throw new AuthenticationError(`Authentication token must be 'Bearer [token]'`);
		}
		throw new AuthenticationError(`Authorization header must be provided`);
	}
	else if (context.connection && context.connection.context.Authorization) {
		if (context.connection.context.Authorization) {
			const token = context.connection.context.Authorization.split('Bearer ')[1];
			if (token) {
				try {
					const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
					return user;
				} catch (err) {
					throw new AuthenticationError('Invalid/expired token');
				}
			}
			throw new Error(`Authentication token must be 'Bearer [token]'`);
		}
		throw new Error(`Authorization header must be provided`);
	}
};
