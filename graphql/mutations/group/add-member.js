const checkAuth = require('../../../utils/check-auth');
const Group = require('../../../models/Group');
const { UserInputError } = require('apollo-server');
const User = require('../../../models/User');
const Message = require('../../../models/Message');

module.exports = async (_, { userId, groupName }, context) => {
	try {
		const { pubsub } = context;
		const { id, username } = checkAuth(context);
		const errors = {};
		const otherUser = await User.findOne({ _id: userId });
		if (!otherUser) {
			errors.userId = 'User with this this userId not found !';
			throw errors;
		}
		const group = await Group.findOne({ name: groupName });
		if (!group) {
			errors.groupName = 'No group with this name found !';
			throw errors;
		}
		if (group.admin != username) {
			throw new UserInputError('You are not allowed to add members to this group !');
		}
		if (group.members.find((member) => member.username == otherUser.username)) {
			errors.userId = 'This user is already a member of this group !';
			throw errors;
		}
		if (userId.trim() == '') {
			errors.userId = 'Unique userId of user must be provided to add them to your group !';
			throw errors;
		}
		else if (id == userId) {
			errors.userId = " You are already admin of group , so don't add yourself ! ";
			throw errors;
		}
		otherUser.groups = [
			group.name,
			...otherUser.groups
		];
		await otherUser.save();
		const membersToBeReturned = [
			...group.members,
			{
				username  : otherUser.username,
				createdAt : new Date().toISOString()
			}
		];
		group.members = membersToBeReturned;
		await group.save();
		const message = await Message.create({
			from    : 'server',
			to      : group.name,
			type    : 'group',
			content : `Admin has added ${otherUser.username} to group.`
		});
		pubsub.publish('NEW_CONTACT', {
			newContact : { username: otherUser.username, contactName: group.name, type: 'group' }
		});
		pubsub.publish('NEW_MESSAGE', { newMessage: message });
		return membersToBeReturned;
	} catch (err) {
		console.log(err);
		if (err.kind == 'ObjectId') {
			throw new UserInputError('Bad Input !', { errors: { userId: 'Please provide a valid userId !' } });
		}
		throw new UserInputError('Bad Input !', { errors: err });
	}
};
