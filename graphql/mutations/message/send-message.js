const checkAuth = require('../../../utils/check-auth');
const User = require('../../../models/User');
const Message = require('../../../models/Message');
const { UserInputError } = require('apollo-server');

module.exports = async (_, { to, content }, context) => {
	try {
		const { username, id } = checkAuth(context);
		const errors = {};
		let type;
		const user = await User.findOne({ username });
		const recepient = await User.findOne({ username: to });
		if (!recepient) {
			errors.to = 'User not found !';
			throw errors;
		}
		else if (recepient.username === user.username) {
			errors.to = 'You cannot send message to yourself !';
			throw errors;
		}
		// console.log(user.contacts);
		if (user.contacts.find((u) => u === to)) {
			type = 'personal';
		}
		else if (user.groups.find((g) => g === to)) {
			type = 'group';
		}
		else {
			errors.to = 'The given name is not in your contact list as well as in your group list !';
			throw errors;
		}
		if (content.trim === '') {
			errors.content = 'Message must not be empty !';
			throw errors;
		}
		const message = await Message.create({
			from    : username,
			to,
			content,
			type
		});
		return {
			id : message._id,
			...message._doc
		};
	} catch (err) {
		console.log(err);
		throw new UserInputError('Error occured !', { errors: err });
	}
};