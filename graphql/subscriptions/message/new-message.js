const { withFilter, AuthenticationError } = require('apollo-server');
const Group = require('../../../models/Group');
const checkAuth = require('../../../utils/check-auth');

module.exports = {
	subscribe : withFilter(
		(_, __, context) => {
			const { pubsub } = context;
			const user = checkAuth(context);
			if (!user) {
				throw new AuthenticationError('Unauthenticated !');
			}
			return pubsub.asyncIterator([
				'NEW_MESSAGE'
			]);
		},
		async ({ newMessage }, _, context) => {
			const user = checkAuth(context);
			if (newMessage.type == 'personal') {
				if (newMessage.from === user.username || newMessage.to === user.username) {
					return true;
				}
				return false;
			}
			else if (newMessage.type == 'group') {
				const group = await Group.findOne({ name: newMessage.to });
				const members = group.members.map((m) => m.username);
				// console.log(members, user.username, members.includes(user.username));
				if (members.includes(user.username)) {
					return true;
				}
				return false;
			}
		}
	)
};
