const sendMessage = require('../mutations/message/send-message');

module.exports = {
	Query    : {},
	Mutation : {
		sendMessage : sendMessage
	}
};
