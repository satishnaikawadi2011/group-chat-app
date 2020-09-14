const checkAuth = require('../../../utils/check-auth');
const Message = require('../../../models/Message');
const User = require('../../../models/User');

module.exports = async (_, __, context) => {
	try {
		let latestMessages = {};
		const { username } = checkAuth(context);
		const { groups, contacts } = await User.findOne({ username });
		for (let i = 0; i < groups.length; i++) {
			const groupName = groups[i];
			const latestMessage = await Message.find({
				from : {
					$nin : [
						'server'
					]
				},
				to   : groupName
			})
				.sort({ createdAt: -1 })
				.limit(1)
				.select([
					'content',
					'from',
					'createdAt'
				]);
			latestMessages[groupName] = latestMessage[0];
		}

		for (let i = 0; i < contacts.length; i++) {
			const contactName = contacts[i];
			const latestMessage = await Message.find({
				from : {
					$in : [
						contactName,
						username
					]
				},
				to   : {
					$in : [
						contactName,
						username
					]
				}
			})
				.sort({ createdAt: -1 })
				.limit(1)
				.select([
					'content',
					'from',
					'createdAt'
				])
				.sort({ createdAt: -1 })
				.limit(1)
				.select([
					'content',
					'from',
					'createdAt'
				]);
			latestMessages[contactName] = latestMessage[0];
		}
		return latestMessages;
	} catch (err) {
		console.log(err);
	}
};
