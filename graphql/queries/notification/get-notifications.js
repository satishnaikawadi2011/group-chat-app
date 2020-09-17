const checkAuth = require('../../../utils/check-auth');
const Notification = require('../../../models/Notification');

module.exports = async (_, __, context) => {
	try {
		const { username } = checkAuth(context);
		const notifications = await Notification.find({ recepient: username }).sort('read -createdAt');
		// console.log(notifications);
		const transformedNotifications = notifications.map((n) => {
			return {
				...n._doc,
				id : n._id
			};
		});
		return transformedNotifications;
	} catch (err) {
		console.log(err);
	}
};
