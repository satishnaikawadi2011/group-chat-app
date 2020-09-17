const getNotifications = require('../queries/notification/get-notifications');
const newNotification = require('../subscriptions/notification/new-notification');
const readNotifications = require('../mutations/notification/read-notifications');

module.exports = {
	Query        : {
		getNotifications : getNotifications
	},
	Mutation     : {
		markNotificationsAsRead : readNotifications
	},
	Subscription : {
		newNotification : newNotification
	}
};
