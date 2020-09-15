const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GroupSchema = new Schema(
	{
		admin   : {
			type     : String,
			required : true
		},
		name    : {
			type     : String,
			required : true
		},
		members : [
			{ username: String, createdAt: String }
		]
	},
	{ timestamps: true }
);

const Group = mongoose.model('group', GroupSchema);
module.exports = Group;
