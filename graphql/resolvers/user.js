const signup = require('../mutations/user/signup');
const getUsers = require('../queries/user/get-users');
const login = require('../queries/user/login');
const addContact = require('../mutations/user/add-contact');
const removeContact = require('../mutations/user/remove-contact');

module.exports = {
	Query    : {
		getUsers : getUsers,
		login    : login
	},
	Mutation : {
		signup        : signup,
		addContact    : addContact,
		removeContact : removeContact
	}
};
