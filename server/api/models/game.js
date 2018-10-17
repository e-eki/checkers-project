const mongoose = require('mongoose');
const Promise = require('bluebird');

const gameSchema = require('../schemas/game');

const GameModel = mongoose.model('Game', gameSchema);

module.exports = {
	
	query: function(config) {
		if (config) return GameModel.find(config);

		return GameModel.find({});
	},
	
	create: function(data) {
		const game = new GameModel({
			userId : data.userId,
			isFinished  :  data.isFinished,
			movesCount:  data.movesCount,
			totalOfGame: data.totalOfGame,
			userColor: data.userColor,
			boardSize: data.boardSize,
			level: data.level,
			mode: data.mode,
			actorsData: data.actorsData,    //TODO!
		});
	
		return game.save();
	},

	update: function(id, data) {
		const user = new GameModel({
			_id: id,
			userId : data.userId,
			isFinished  :  data.isFinished,
			movesCount:  data.movesCount,
			totalOfGame: data.totalOfGame,
			userColor: data.userColor,
			boardSize: data.boardSize,
			level: data.level,
			mode: data.mode,
			actorsData: data.actorsData,    //TODO!
		});

		return GameModel.findOneAndUpdate({_id: id}, user, {new: true});
	},
	
	delete: function(id) {
		return GameModel.findOneAndRemove({_id: id});
	},

	findUserUnfinishedGames: function(userId) {
		// костыль для заворачивания в промис
		return Promise.resolve(
			GameModel.
			find({userId: userId}).
			where('isFinished').equals('false').
			exec())
			  .then((result) => {

				return result;
			  })
	}
}