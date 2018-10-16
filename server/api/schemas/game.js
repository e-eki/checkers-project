
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const Schema = mongoose.Schema;

const gameSchema = new Schema(
	{
		userId:  { type: ObjectId },
		isFinished  :  { type: Boolean },
		movesCount:  { type: Number },
		totalOfGame: { type: Number },
		userColor: { type: String },
		boardSize: { type: Number },
		level: { type: String },
		mode: { type: String },
		actorsData: { type: [Number] },    //TODO!
		
	},
	{versionKey: false}   //отключение поля __v, которое указывает на версию документа
);

module.exports = gameSchema;
