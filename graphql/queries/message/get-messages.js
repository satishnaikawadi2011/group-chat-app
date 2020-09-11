const checkAuth = require('../../../utils/check-auth');
const User = require('../../../models/User');
const Message = require('../../../models/Message');
const { ForbiddenError, UserInputError } = require('apollo-server');
const Group = require('../../../models/Group');

module.exports = async (_, { otherUser, type }, context) => {
	try {
		const { id, username } = checkAuth(context);
		let messages;
		if (type == 'personal') {
			const otherUserData = await User.findOne({ username: otherUser });
			if (!otherUserData) {
				throw new ForbiddenError('No user found with this username !');
			}
			if (otherUser == username) {
				throw new UserInputError('Otheruser must be other than you !');
			}
			messages = await Message.find({
				from : {
					$in : [
						username,
						otherUser,
						'server'
					]
				},
				to   : {
					$in : [
						username,
						otherUser
					]
				},
				type
			}).sort({ createdAt: -1 });
		}
		else {
			const group = await Group.findOne({ name: otherUser }).populate('members', 'username');
			if (!group) {
				throw new ForbiddenError('No group found with this username !');
			}
			if (!group.members.find((m) => m.username == username) && group.admin != username) {
				throw new UserInputError('You cannot access messages from this group !');
			}
			if (otherUser == username) {
				throw new UserInputError('Otheruser must be other than you !');
			}
			messages = await Message.find({
				from : {
					$in : [
						...group.members.map((m) => m.username),
						group.admin,
						'server'
					]
				},
				to   : otherUser,
				type
			}).sort({ createdAt: -1 });
		}

		const transformedMessages = messages.map((m) => {
			return {
				id : m._id,
				...m._doc
			};
		});
		if (type == 'personal') {
			return transformedMessages.filter((m) => {
				if (m.from == 'server' && m.to == otherUser) {
					return false;
				}
				return true;
			});
		}
		else {
			return transformedMessages;
		}
	} catch (err) {
		console.log(err);
	}
};
