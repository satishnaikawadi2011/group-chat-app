const checkAuth = require('../../../utils/check-auth');
const Notification = require('../../../models/Notification');

module.exports = async (_, { ids }, context) => {
	try {
		const { username, id } = checkAuth(context);
		const notifications = await Notification.find({ _id: { $in: ids } });
		notifications.forEach((n) => {
			n.read = true;
			n.save();
		});
		return ids;
	} catch (err) {
		console.log(err);
	}
};
