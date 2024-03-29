const User = require('../../../models/User');
const Group = require('../../../models/Group');
const { withFilter } = require('apollo-server');
const checkAuth = require('../../../utils/check-auth');

module.exports = {
	subscribe : withFilter(
		(_, __, context) => {
			const { pubsub } = context;
			const user = checkAuth(context);
			if (!user) {
				throw new AuthenticationError('Unauthenticated !');
			}
			return pubsub.asyncIterator('DELETE_CONTACT');
		},
		async ({ deleteContact }, _, context) => {
			const { username } = checkAuth(context);
			// console.log(deleteContact);
			if (deleteContact.type === 'personal' || deleteContact.type === 'personal2') {
				if (deleteContact.username === username) {
					return true;
				}
				return false;
			}
			else {
				const members = deleteContact.members.map((m) => m.username);
				// console.log(members);
				if (members.includes(username)) {
					return true;
				}
				return false;
			}
		}
	)
};
