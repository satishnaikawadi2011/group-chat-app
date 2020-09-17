const { withFilter, AuthenticationError } = require('apollo-server');
const Group = require('../../../models/Group');
const checkAuth = require('../../../utils/check-auth');
const { NEW_NOTIFICATION } = require('../../../utils/eventTypes');

module.exports = {
	subscribe : withFilter(
		(_, __, context) => {
			const { pubsub } = context;
			const user = checkAuth(context);
			if (!user) {
				throw new AuthenticationError('Unauthenticated !');
			}
			return pubsub.asyncIterator([
				NEW_NOTIFICATION
			]);
		},
		async ({ newNotification }, _, context) => {
			const { username } = checkAuth(context);
			if (newNotification.recepient === username) {
				return true;
			}
			return false;
		}
	)
};
