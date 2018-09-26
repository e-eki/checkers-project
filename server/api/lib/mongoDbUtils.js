
const mongoose = require('mongoose');
const config = require('../../config');

//const User = require('../models/user');

module.exports = {

	setUpConnection: function() {
		mongoose.connect(config.db.mongo.url, config.db.mongo.options, function (err) {
			if (err) console.log(err);
			 
			console.log('Successfully connected');
		});
	},

	closeConnection: function() {
		mongoose.disconnect();  // отключение от базы данных
	}
	
	/*listNotes: function(id) {
		if (id) return User.findOne({_id: id});

		return User.find();
	},
	
	createNote: function(data) {
		const user = new User({
			login     : data.login,
			email     : data.email,
			password     : data.password,
		});
	
		return user.save();
	},

	updateNote: function(id, data) {
		const user = new Note({
			_id: id,
			login     : data.login,
			email     : data.email,
			password     : data.password,
		});

		return User.findOneAndUpdate({_id: id}, user, {new: true});
	},
	
	deleteNote: function(id) {
		return User.findOneAndRemove({_id: id});
	},*/
}

