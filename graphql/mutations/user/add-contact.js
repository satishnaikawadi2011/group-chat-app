const checkAuth = require('../../../utils/check-auth');
const { UserInputError } = require('apollo-server');
const User = require('../../../models/User');

module.exports = async (_, { id: userID }, context) => {
	try {
		// console.log(otherUser);
		const { id, username } = checkAuth(context);
		const errors = {};
		if (userID.trim() === '') {
			errors.userId = 'Unique userId of user must be provided to add them to your contact !';
			throw errors;
		}
		else if (id === userID) {
			errors.userId = ' You cannot add yourself in your contacts !';
			throw errors;
		}
		const otherUser = await User.findOne({ _id: userID });
		if (!otherUser) {
			errors.userId = 'User with this this userId not found !';
			throw errors;
		}
		const user = await User.findOne({ username });
		if (user.contacts.find((u) => u === otherUser.username)) {
			errors.userId = 'This user is already in your contacts !';
			throw errors;
		}
		user.contacts = [
			...user.contacts,
			otherUser.username
		];
		await user.save();
		return [
			...user.contacts
		];
	} catch (err) {
		// console.log(Object.keys(err));
		if (err.kind === 'ObjectId') {
			throw new UserInputError('Bad Input !', { errors: { userId: 'Please provide a valid userId !' } });
		}
		throw new UserInputError('Bad Input !', { errors: err });
	}
};
