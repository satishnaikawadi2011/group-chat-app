const checkAuth = require('../../../utils/check-auth');
const Group = require('../../../models/Group');
const { UserInputError } = require('apollo-server');
const User = require('../../../models/User');

module.exports = async (_, { userId, groupName }, context) => {
	try {
		const { id, username } = checkAuth(context);
		const errors = {};
		const group = await Group.findOne({ name: groupName });
		if (!group) {
			errors.groupName = 'No group with this name found !';
			throw errors;
		}
		if (group.admin !== username) {
			throw new UserInputError('You are not allowed to add members to this group !');
		}
		console.log(group.members);
		if (group.members.find((member) => member === userId)) {
			errors.userId = 'This user is already a member of this group !';
			throw errors;
		}
		if (userId.trim() === '') {
			errors.userId = 'Unique userId of user must be provided to add them to your group !';
			throw errors;
		}
		else if (id === userId) {
			errors.userId = " You are already admin of group , so don't add yourself ! ";
			throw errors;
		}
		const otherUser = await User.findOne({ _id: userId });
		if (!otherUser) {
			errors.userId = 'User with this this userId not found !';
			throw errors;
		}
		otherUser.groups = [
			group._id,
			...otherUser.groups
		];
		await otherUser.save();
		group.members = [
			...group.members,
			userId
		];
		await group.save();
		const group2 = await Group.findOne({ name: groupName }).populate('members');
		console.log(group2.members);
		return group2.members;
	} catch (err) {
		console.log(err);
		if (err.kind === 'ObjectId') {
			throw new UserInputError('Bad Input !', { errors: { userId: 'Please provide a valid userId !' } });
		}
		throw new UserInputError('Bad Input !', { errors: err });
	}
};
