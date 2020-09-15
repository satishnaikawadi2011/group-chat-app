const checkAuth = require('../../../utils/check-auth');
const Message = require('../../../models/Message');
const User = require('../../../models/User');
const Group = require('../../../models/Group');
const { ForbiddenError, UserInputError } = require('apollo-server');

module.exports = async (_, { name }, context) => {
	try {
		const { username, id } = checkAuth(context);
		const group = await Group.findOne({ name });
		if (!group) {
			throw new UserInputError('No group found with this name !');
		}
		const members = group.members.map((m) => m.username);
		if (!members.includes(username)) {
			throw new ForbiddenError('You are not allowed to fetch this group !');
		}
		return {
			...group._doc,
			id : group._id
		};
	} catch (err) {
		console.log(err);
	}
};
