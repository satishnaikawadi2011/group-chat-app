const sendMessage = require('../mutations/message/send-message');
const getLatestMessages = require('../queries/message/get-latest-messages');
const getMessages = require('../queries/message/get-messages');
const deleteContact = require('../subscriptions/group/delete-contact');
const newMessage = require('../subscriptions/message/new-message');

module.exports = {
	Query        : {
		getMessages       : getMessages,
		getLatestMessages : getLatestMessages
	},
	Mutation     : {
		sendMessage : sendMessage
	},
	Subscription : {
		newMessage    : newMessage,
		deleteContact : deleteContact
	}
};
