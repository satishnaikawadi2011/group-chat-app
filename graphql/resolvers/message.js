const sendMessage = require('../mutations/message/send-message');
const getMessages = require('../queries/message/get-messages');
const newMessage = require('../subscriptions/message/new-message');

module.exports = {
	Query        : {
		getMessages : getMessages
	},
	Mutation     : {
		sendMessage : sendMessage
	},
	Subscription : {
		newMessage : newMessage
	}
};
