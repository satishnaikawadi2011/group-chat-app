const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema(
	{
		type      : {
			type     : String,
			required : true
		},
		recepient : {
			type     : String,
			required : true
		},
		sender    : {
			type     : String,
			required : true
		},
		read      : {
			type    : Boolean,
			default : false
		},
		content   : {
			type     : String,
			required : true
		}
	},
	{
		timestamps : true
	}
);

const Notification = mongoose.model('notification', notificationSchema);

module.exports = Notification;
