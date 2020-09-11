const checkAuth = require('../../../utils/check-auth');
const Group = require('../../../models/Group');
const { UserInputError } = require('apollo-server');
const User = require('../../../models/User');
const Message = require('../../../models/Message');
const mongoose = require('mongoose');
const { findOne } = require('../../../models/User');

module.exports = async (_, { groupName }, context) => {
	try {
		const { id, username } = checkAuth(context);
		const errors = {};
		const group = await Group.findOne({ name: groupName });
		if (!group) {
			errors.groupName = 'No group with this name found !';
			throw errors;
		}
		if (group.admin == username) {
			errors.username = 'You cannot left the group as you are admin , instead remove others or delete the group.';
		}
		const isMember = group.members.find((member) => member.username == username);
		if (!isMember) {
			errors.userId = 'You are not a member of this group !';
			throw errors;
		}
		const user = await User.findOne({ username });
		const filteredGroups = user.groups.filter((gname) => gname != group.name);
		user.groups = filteredGroups;
		await user.save();
		group.members = group.members.filter((m) => m.username != username);
		await group.save();
		await Message.create({
			from    : 'server',
			to      : group.name,
			type    : 'group',
			content : `${username} has left the group.`
		});
		return 'You have successfully left the group.';
	} catch (err) {
		console.log(err);
		if (err.kind == 'ObjectId') {
			throw new UserInputError('Bad Input !', { errors: { userId: 'Please provide a valid userId !' } });
		}
		throw new UserInputError('Bad Input !', { errors: err });
	}
};
