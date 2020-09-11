const checkAuth = require('../../../utils/check-auth');
const { UserInputError } = require('apollo-server');
const User = require('../../../models/User');
const Message = require('../../../models/Message');

module.exports = async (_, { id: userID }, context) => {
	try {
		const { id, username } = checkAuth(context);
		const errors = {};
		if (userID.trim() == '') {
			errors.userId = 'Unique userId of user must be provided to delete them from your contact !';
			throw errors;
		}
		else if (id == userID) {
			errors.userId = 'You cannot delete yourself from your contacts !';
			throw errors;
		}
		const otherUser = await User.findOne({ _id: userID });
		if (!otherUser) {
			errors.userId = 'User with this this userId not found !';
			throw errors;
		}
		const user = await User.findOne({ username });
		if (!user.contacts.find((u) => u == otherUser.username)) {
			errors.userId = 'This user is not present in your contacts !';
			throw errors;
		}
		user.contacts = user.contacts.filter((u) => u != otherUser.username);
		otherUser.contacts = otherUser.contacts.filter((u) => u != username);
		await Message.deleteMany({
			from : {
				$in : [
					otherUser.username,
					username
				]
			},
			to   : {
				$in : [
					otherUser.username,
					username
				]
			}
		});
		await otherUser.save();
		await user.save();
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
