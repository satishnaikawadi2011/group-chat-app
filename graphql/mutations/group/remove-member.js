const checkAuth = require('../../../utils/check-auth');
const Group = require('../../../models/Group');
const { UserInputError } = require('apollo-server');
const User = require('../../../models/User');
const Message = require('../../../models/Message');
const mongoose = require('mongoose');
const Notification = require('../../../models/Notification');
const { REMOVED, NEW_NOTIFICATION } = require('../../../utils/eventTypes');

module.exports = async (_, { otherUsername, groupName }, context) => {
	try {
		const { id, username } = checkAuth(context);
		const { pubsub } = context;
		const errors = {};
		const group = await Group.findOne({ name: groupName });
		const otherUser = await User.findOne({ username: otherUsername });
		if (!otherUser) {
			errors.username = 'User with this this userId not found !';
			throw errors;
		}
		if (!group) {
			errors.groupName = 'No group with this name found !';
			throw errors;
		}
		if (group.admin != username) {
			throw new UserInputError('You are not allowed to remove members from this group !');
		}
		const isMember = group.members.find((member) => member.username == otherUser.username);
		if (!isMember) {
			errors.username = 'This user is not a member of this group !';
			throw errors;
		}
		if (otherUsername.trim() == '') {
			errors.username = 'Unique userId of user must be provided to add them to your group !';
			throw errors;
		}
		else if (username === otherUsername) {
			errors.username = " You are a admin of group , so don't remove yourself !";
			throw errors;
		}
		const filteredGroups = otherUser.groups.filter((gname) => gname != group.name);
		otherUser.groups = filteredGroups;
		await otherUser.save();
		group.members = group.members.filter((m) => m.username != otherUser.username);
		await group.save();
		const message = await Message.create({
			from    : 'server',
			to      : group.name,
			type    : 'group',
			content : `Admin has removed ${otherUser.username} from group.`
		});
		const notification = await Notification.create({
			sender    : username,
			recepient : otherUser.username,
			type      : REMOVED,
			content   : `${username} has removed you from group ${group.name}.`
		});
		pubsub.publish(NEW_NOTIFICATION, { newNotification: { ...notification._doc, id: notification._id } });
		pubsub.publish('DELETE_CONTACT', {
			deleteContact : { username: otherUser.username, name: group.name, type: 'personal2' }
		});
		pubsub.publish('NEW_MESSAGE', { newMessage: message });
		return otherUser.username;
	} catch (err) {
		console.log(err);
		if (err.kind == 'ObjectId') {
			throw new UserInputError('Bad Input !', { errors: { userId: 'Please provide a valid userId !' } });
		}
		throw new UserInputError('Bad Input !', { errors: err });
	}
};
