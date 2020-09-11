const createGroup = require('../mutations/group/create-group');
const addMember = require('../mutations/group/add-member');
const deleteGroup = require('../mutations/group/delete-group');
const removeMember = require('../mutations/group/remove-member');
const leftGroup = require('../mutations/group/left-group');

module.exports = {
	Query    : {},
	Mutation : {
		createGroup  : createGroup,
		addMember    : addMember,
		deleteGroup  : deleteGroup,
		removeMember : removeMember,
		leftGroup    : leftGroup
	}
};
