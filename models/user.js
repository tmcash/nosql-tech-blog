const { Schema, model } = require("mongoose");

const userSchema = Schema({
	username: {
		type: String,
		unique: true,
		Required: true,
		trim: true,
	},


	email: {
		type: String,
		required: true,
		unique: true,
		match: [/.+\@.+\..+/],
	},


	thoughs: [
		{
			type: Schema.Types.ObjectId,
			ref: "thought",
		},
	],


	friends: [
		{
			type: Schema.Types.ObjectId,
			ref: "User",
		},
	],
},
{
toJSON: {
virtuals: true
},
id: false
});

// This function returns a friend count
userSchema.virtual('friendCount').get(function() {
return this.friends.length;
});


const User = model('User', userSchema);


module.exports = User;