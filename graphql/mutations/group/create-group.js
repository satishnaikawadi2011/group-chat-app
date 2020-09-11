const { UserInputError } = require('apollo-server');
const checkAuth = require('../../../utils/check-auth');
const User = require('../../../models/User');
const Group = require('../../../models/Group');

module.exports = async (_, { name }, context) => {
	try {
		const { id, username } = checkAuth(context);
		const errors = {};
		if (name.trim() == '') {
			errors.name = 'Group Name must not be empty !';
			throw errors;
		}
		const isUnique1 = await User.findOne({ username: name });
		const isUnique2 = await Group.findOne({ name });
		if (isUnique1 || isUnique2) {
			errors.name = 'This Group Name is already been taken, try another one !';
			throw errors;
		}

		const group = await Group.create({
			name,
			admin   : username,
			members : [
				{ username, createdAt: new Date().toISOString() }
			]
		});
		const user = await User.findOne({ username });
		user.groups = [
			group.name,
			...user.groups
		];
		user.save();
		return {
			id : group._id,
			...group._doc
		};
	} catch (err) {
		console.log(err);
		throw new UserInputError('Bad Input !', { errors: err });
	}
};
