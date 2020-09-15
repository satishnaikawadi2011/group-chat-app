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
			return pubsub.asyncIterator('NEW_CONTACT');
		},
		async ({ newContact }, _, context) => {
			const { username } = checkAuth(context);
			if (newContact.username === username) {
				return true;
			}
			return false;
		}
	)
};
