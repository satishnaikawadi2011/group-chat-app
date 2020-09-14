const signup = require('../mutations/user/signup');
const getUsers = require('../queries/user/get-users');
const login = require('../queries/user/login');
const addContact = require('../mutations/user/add-contact');
const removeContact = require('../mutations/user/remove-contact');
const getUser = require('../queries/user/get-user');

module.exports = {
	Query    : {
		getUsers : getUsers,
		login    : login,
		getUser  : getUser
	},
	Mutation : {
		signup        : signup,
		addContact    : addContact,
		removeContact : removeContact
	}
};
