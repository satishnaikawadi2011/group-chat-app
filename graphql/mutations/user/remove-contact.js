const checkAuth = require('../../../utils/check-auth');
const { UserInputError } = require('apollo-server');
const User = require('../../../models/User');
const Message = require('../../../models/Message');
const { ADDED, NEW_NOTIFICATION, REMOVED } = require('../../../utils/eventTypes');
const Notification = require('../../../models/Notification');

module.exports = async (_, { username: otherUsername }, context) => {
	try {
		const { pubsub } = context;
		const { id, username } = checkAuth(context);
		const errors = {};
		if (otherUsername.trim() == '') {
			errors.username = 'Unique username of user must be provided to delete them from your contact !';
			throw errors;
		}
		else if (username == otherUsername) {
			errors.username = 'You cannot delete yourself from your contacts !';
			throw errors;
		}
		const otherUser = await User.findOne({ username: otherUsername });
		if (!otherUser) {
			errors.username = 'User with this this username not found !';
			throw errors;
		}
		const user = await User.findOne({ username });
		if (!user.contacts.find((u) => u == otherUser.username)) {
			errors.username = 'This user is not present in your contacts !';
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
		const notification = await Notification.create({
			sender    : username,
			recepient : otherUser.username,
			type      : REMOVED,
			content   : `${username} has removed you from their contacts.`
		});
		pubsub.publish(NEW_NOTIFICATION, { newNotification: { ...notification._doc, id: notification._id } });
		pubsub.publish('DELETE_CONTACT', {
			deleteContact : { username: otherUser.username, name: username, type: 'personal' }
		});
		await otherUser.save();
		await user.save();
		return otherUsername;
	} catch (err) {
		console.log(err);
		if (err.kind == 'ObjectId') {
			throw new UserInputError('Bad Input !', { errors: { userId: 'Please provide a valid userId !' } });
		}
		throw new UserInputError('Bad Input !', { errors: err });
	}
};
