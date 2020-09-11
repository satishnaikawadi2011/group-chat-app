const User = require('../../../models/User');

module.exports = async () => {
	try {
		const users = await User.find({})
			.select([
				'-email',
				'-password'
			])
			.populate('groups');
		const transformedUsers = users.map((u) => {
			u.id = u._id;
			return u;
		});
		return transformedUsers;
	} catch (err) {
		console.log(err);
	}
};
