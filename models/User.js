const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
	{
		username : {
			type     : String,
			unique   : true,
			required : true
		},
		email    : {
			type     : String,
			unique   : true,
			required : true
		},
		password : {
			type      : String,
			minlength : 6,
			required  : true
		},
		groups   : [
			{ type: String }
		],
		contacts : [
			{
				type : String
			}
		],
		imageUrl : {
			type    : String,
			default : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
		}
	},
	{ timestamps: true }
);
const User = mongoose.model('user', UserSchema);
module.exports = User;
