const validateSignup = require('../../../utils/validateSignup');
const User = require('../../../models/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../../../utils/generate-token');
const { UserInputError } = require('apollo-server');

module.exports = async (_, args) => {
	try {
		const { email, password, username, confirmPassword } = args;
		const { errors, valid } = validateSignup(args);
		if (!valid) {
			throw errors;
		}
		const existUserWithUsername = await User.findOne({ username });
		if (existUserWithUsername) {
			errors.username = 'This username is already taken !';
			throw errors;
		}
		const existUserWithEmail = await User.findOne({ email });
		if (existUserWithEmail) {
			errors.email = 'This email is already in use !';
			throw errors;
		}
		const hash = await bcrypt.hash(password, 6);
		const user = await User.create({
			email,
			password        : hash,
			confirmPassword,
			username
		});

		const token = generateToken({ id: user._id, ...user._doc });
		return {
			id    : user._id,
			...user._doc,
			token
		};
	} catch (err) {
		console.log(err);
		throw new UserInputError('bad Input !', { errors: err });
	}
};
