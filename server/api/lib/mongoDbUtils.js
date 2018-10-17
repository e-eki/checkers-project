
const mongoose = require('mongoose');
const config = require('../../config');

module.exports = {

	// установка соединения с БД
	setUpConnection: function() {
		mongoose.connect(config.db.mongo.url, config.db.mongo.options, function (err) {
			if (err) console.log(err);
			 
			console.log('Successfully connected');
		});
	},

	// отключение от базы данных  (??)
	closeConnection: function() {
		mongoose.disconnect();  
	},
}

