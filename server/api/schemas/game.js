
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const gameSchema = new Schema(
	{
		userId:  Schema.Types.ObjectId,
		isFinished  :  Boolean,
		movesCount:  Number,
		totalOfGame: String,
		userColor: String,
		boardSize: Number,
		level: String,
		mode: String,
		actorsData: [{ color: String, type: String, x: Number, y: Number }],    //TODO!
		
	},
	{versionKey: false}   //отключение поля __v, которое указывает на версию документа
);

module.exports = gameSchema;
