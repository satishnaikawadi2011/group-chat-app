const checkAuth = require('../../../utils/check-auth');
const Group = require('../../../models/Group');
const { UserInputError } = require('apollo-server');
const User = require('../../../models/User');
const Message = require('../../../models/Message');
const mongoose = require('mongoose');

module.exports = async (_, { userId, groupName }, context) => {
	try {
		const { id, username } = checkAuth(context);
		const errors = {};
		const group = await Group.findOne({ name: groupName });
		const otherUser = await User.findOne({ _id: userId });
		if (!group) {
			errors.groupName = 'No group with this name found !';
			throw errors;
		}
		if (group.admin != username) {
			throw new UserInputError('You are not allowed to remove members from this group !');
		}
		const isMember = group.members.find((member) => member.username == otherUser.username);
		if (!isMember) {
			errors.userId = 'This user is not a member of this group !';
			throw errors;
		}
		if (userId.trim() == '') {
			errors.userId = 'Unique userId of user must be provided to add them to your group !';
			throw errors;
		}
		else if (id == userId) {
			errors.userId = " You are a admin of group , so don't remove yourself !";
			throw errors;
		}
		if (!otherUser) {
			errors.userId = 'User with this this userId not found !';
			throw errors;
		}
		const filteredGroups = otherUser.groups.filter((gname) => gname != group.name);
		otherUser.groups = filteredGroups;
		await otherUser.save();
		group.members = group.members.filter((m) => m.username != otherUser.username);
		await group.save();
		await Message.create({
			from    : 'server',
			to      : group.name,
			type    : 'group',
			content : `Admin has removed ${otherUser.username} from group.`
		});
		const members = await User.find({ username: { $in: group.members.map((m) => m.username) } });
		return members.map((m) => {
			return {
				id : m._id,
				...m._doc
			};
		});
	} catch (err) {
		console.log(err);
		if (err.kind == 'ObjectId') {
			throw new UserInputError('Bad Input !', { errors: { userId: 'Please provide a valid userId !' } });
		}
		throw new UserInputError('Bad Input !', { errors: err });
	}
};
