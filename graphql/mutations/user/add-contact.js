const checkAuth = require('../../../utils/check-auth');
const { UserInputError } = require('apollo-server');
const User = require('../../../models/User');
const Message = require('../../../models/Message');

module.exports = async (_, { id: userID }, context) => {
	try {
		const { pubsub } = context;
		const { id, username } = checkAuth(context);
		const errors = {};
		if (userID.trim() == '') {
			errors.userId = 'Unique userId of user must be provided to add them to your contact !';
			throw errors;
		}
		else if (id == userID) {
			errors.userId = 'You cannot add yourself in your contacts !';
			throw errors;
		}
		const otherUser = await User.findOne({ _id: userID });
		if (!otherUser) {
			errors.userId = 'User with this this userId not found !';
			throw errors;
		}
		const user = await User.findOne({ username });
		if (user.contacts.find((u) => u == otherUser.username)) {
			errors.userId = 'This user is already in your contacts !';
			throw errors;
		}
		user.contacts = [
			otherUser.username,
			...user.contacts
		];
		otherUser.contacts = [
			username,
			...otherUser.contacts
		];
		await otherUser.save();
		await user.save();
		pubsub.publish('NEW_CONTACT', { newContact: { username: otherUser.username, name: username } });
		await Message.create({
			to      : otherUser.username,
			from    : 'server',
			content : `${username} has added you to their contacts !`,
			type    : 'personal'
		});
		return [
			...user.contacts
		];
	} catch (err) {
		// console.log(Object.keys(err));
		if (err.kind == 'ObjectId') {
			throw new UserInputError('Bad Input !', { errors: { userId: 'Please provide a valid userId !' } });
		}
		throw new UserInputError('Bad Input !', { errors: err });
	}
};
