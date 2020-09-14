const User = require('../../../models/User');
const checkAuth = require('../../../utils/check-auth');

module.exports = async (_, __, context) => {
	try {
		const { id, username } = checkAuth(context);
		const user = await User.findOne({ username }).select('-password');
		return {
			...user._doc,
			id : user._id
		};
	} catch (err) {
		console.log(err);
	}
};
