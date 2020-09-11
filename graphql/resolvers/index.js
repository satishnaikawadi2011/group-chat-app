const userResolver = require('./user');
const messageResolver = require('./message');
const groupResolvers = require('./group');
const User = require('../../models/User');

// User resolver for Group resolver
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

module.exports = {
	User     : {
		createdAt : (parent) => parent.createdAt.toISOString()
	},
	Message  : {
		createdAt : (parent) => parent.createdAt.toISOString()
	},
	Group    : {
		createdAt : (parent) => parent.createdAt.toISOString(),
		members   : userInGroup
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
