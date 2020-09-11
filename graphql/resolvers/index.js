const userResolver = require('./user');
const messageResolver = require('./message');
const groupResolvers = require('./group');
const User = require('../../models/User');
const Message = require('../../models/Message');

//TODO: User resolver for Group resolver
const userInGroup = async (parent) => {
	// console.log('Members', parent);
	const user = await User.find({ _id: { $in: parent.members } }).select([
		'-password',
		'-email'
	]);
	const transformedUsers = user.map((user) => {
		return {
			id : user._id,
			...user._doc
		};
	});
	return transformedUsers;
};

// TODO: get messages in particular group
const getGroupMessages = async (parent) => {
	// console.log('ots called');
	const messages = await Message.find({ type: 'group', to: parent.name }).sort({ createdAt: -1 });
	const transformedMessages = messages.map((m) => {
		return {
			...m._doc,
			id : m._id
		};
	});
	return transformedMessages;
};

module.exports = {
	User     : {
		createdAt : (parent) => parent.createdAt.toISOString()
	},
	Message  : {
		createdAt : (parent) => parent.createdAt.toISOString()
	},
	Group    : {
		createdAt : (parent) => parent.createdAt.toISOString(),
		members   : userInGroup,
		Messages  : getGroupMessages
	},
	Query    : {
		...userResolver.Query,
		...messageResolver.Query,
		...groupResolvers.Query
	},
	Mutation : {
		...userResolver.Mutation,
		...messageResolver.Mutation,
		...groupResolvers.Mutation
	}
};
