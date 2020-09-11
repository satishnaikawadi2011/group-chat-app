const checkAuth = require('../../../utils/check-auth');
const Group = require('../../../models/Group');
const { UserInputError } = require('apollo-server');
const User = require('../../../models/User');
const Message = require('../../../models/Message');

module.exports = async (_, { id: groupId }, context) => {
	try {
		const { id, username } = checkAuth(context);
		const errors = {};
		const group = await Group.findOne({ _id: groupId });
		if (!group) {
			errors.groupId = 'No group with this id found !';
			throw errors;
		}
		if (group.admin != username) {
			throw new UserInputError('You are not allowed to delete this group !');
		}
		const members = await User.find({
			username : {
				$in : [
					...group.members.map((m) => m.username),
					username
				]
			}
		});
		members.forEach((m) => {
			m.groups = m.groups.filter((gname) => gname != group.name);
			m.save();
		});

		await Message.deleteMany({ type: 'group', to: group.name });
		await group.delete();
		return 'Group deleted successfully !';
	} catch (err) {
		console.log(err);
		if (err.kind == 'ObjectId') {
			throw new UserInputError('Bad Input !', { errors: { userId: 'Please provide a valid userId !' } });
		}
		throw new UserInputError('Bad Input !', { errors: err });
	}
};
