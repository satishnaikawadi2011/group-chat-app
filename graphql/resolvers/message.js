const sendMessage = require('../mutations/message/send-message');
const getMessages = require('../queries/message/get-messages');

module.exports = {
	Query    : {
		getMessages : getMessages
	},
	Mutation : {
		sendMessage : sendMessage
	}
};
