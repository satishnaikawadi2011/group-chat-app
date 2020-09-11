const signup = require('../mutations/user/signup');
const getUsers = require('../queries/user/get-users');
const login = require('../queries/user/login');
const addContact = require('../mutations/user/add-contact');

module.exports = {
	Query    : {
		getUsers : getUsers,
		login    : login
	},
	Mutation : {
		signup     : signup,
		addContact : addContact
	}
};
