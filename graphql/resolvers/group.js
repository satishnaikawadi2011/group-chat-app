const createGroup = require('../mutations/group/create-group');
const addMember = require('../mutations/group/add-member');

module.exports = {
	Query    : {},
	Mutation : {
		createGroup : createGroup,
		addMember   : addMember
	}
};
