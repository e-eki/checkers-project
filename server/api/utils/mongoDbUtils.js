
const mongoose = require('mongoose');
const config = require('../../config');

const Note = require('../models/note');

module.exports = {

	setUpConnection: function() {
		mongoose.connect(config.db.mongo.url, config.db.mongo.options, function (err) {
			if (err) console.log(err);
			 
			console.log('Successfully connected');
		});
	},
	
	listNotes: function(id) {
		if (id) return Note.findOne({_id: id});

		return Note.find();
	},
	
	createNote: function(data) {
		const note = new Note({
			title: data.title,
			color: data.color,
		});
	
		return note.save();
	},

	updateNote: function(id, data) {
		const note = new Note({
			_id: id,
			title: data.title,
			color: data.color,
		});

		return Note.findOneAndUpdate({_id: id}, note, {new: true});
	},
	
	deleteNote: function(id) {
		return Note.findOneAndRemove({_id: id});
	},
}

