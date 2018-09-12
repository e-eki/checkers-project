
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const NoteSchema = new Schema(
	{
		title     : { type: String },
		color     : { type: String },
	},
	{versionKey: false}   //отключение поля __v, которое указывает на версию документа
);

module.exports = mongoose.model('Note', NoteSchema);
