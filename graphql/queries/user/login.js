const validateLogin = require('../../../utils/validateLogin');
const User = require('../../../models/User');
const generateToken = require('../../../utils/generate-token');
const { UserInputError } = require('apollo-server');
const bcrypt = require('bcryptjs');

module.exports = async (_, args) => {
	try {
		const { username, password } = args;
		const { errors, valid } = validateLogin(args);
		if (!valid) {
			throw errors;
		}
		const user = await User.findOne({ username }).select([
			'-email'
		]);
		if (!user) {
			errors.username = 'No user with this username found !';
			throw errors;
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			errors.password = 'Incorrect password , please try again !';
			throw errors;
		}

		const token = generateToken({ id: user._id, username: user.username });
		return {
			id    : user._id,
			...user._doc,
			token
		};
	} catch (err) {
		console.log(err);
		throw new UserInputError('Bad Input', { errors: err });
	}
};
