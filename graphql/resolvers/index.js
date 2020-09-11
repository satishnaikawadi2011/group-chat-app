const userResolver = require('./user');
const messageResolver = require('./message');
const groupResolvers = require('./group');
const User = require('../../models/User');
const Message = require('../../models/Message');
const Group = require('../../models/Group');

//TODO: Group resolver for User resolver
const getGroupsInUser = async (parent) => {
	try {
		const groups = await Group.find({ name: { $in: parent.groups } });
		return groups.map((g) => {
			return {
				id : g._id,
				...g._doc
			};
		});
	} catch (error) {
		console.log(error);
	}
};

//TODO: User resolver for Group resolver
const userInGroup = async (parent) => {
	try {
		const user = await User.find({ username: { $in: parent.members.map((m) => m.username) } }).select([
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
	} catch (error) {
		console.log(error);
	}
};

// TODO: get messages in particular group
const getGroupMessages = async (parent) => {
	// console.log('ots called');
	try {
		const messages = await Message.find({ type: 'group', to: parent.name }).sort({ createdAt: -1 });
		const transformedMessages = messages.map((m) => {
			return {
				...m._doc,
				id : m._id
			};
		});
		return transformedMessages;
	} catch (error) {
		console.log(error);
	}
};

module.exports = {
	User     : {
		createdAt : (parent) => parent.createdAt.toISOString(),
		groups    : getGroupsInUser
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
