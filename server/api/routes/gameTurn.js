'use strict';

const express = require('express');
const Promise = require('bluebird');
const utils = require('../lib/utils');
const tokenUtils = require('../lib/tokenUtils');
const gameUtils = require('../lib/gameUtils');
const gameModel = require('../models/game');
const Chessboard = require('../game/blocks/chessboard');

let router = express.Router();

//----- endpoint: /api/gameTurn/
router.route('/gameturn')

	// запрос хода ИИ
	.get(function(req, res) { 

		return Promise.resolve(true)
			.then(() => {

				const headerAuthorization = req.header('Authorization') || '';
				const accessToken = tokenUtils.getTokenFromHeader(headerAuthorization);

				return gameUtils.findCurrentGameByToken(accessToken);
			})
			.then((game) => {
				// инициализация шахматной доски - расстановка актеров на доске
				//const chessboard = new Chessboard(game.boardSize, game.mode, game.actorsData);
				const chessboard = new Chessboard(game, game.actorsData);

				const AIturn = chessboard.getAIturn();
				delete AIturn.actor;
				delete AIturn.type;
				delete AIturn.priority;

				chessboard.set(AIturn);  //TODO

				const newActorsData = chessboard.fillActorsDataByActors();
				game.actorsData = newActorsData;

				//??
				game.movesCount++;
				const currentTime = new Date().getTime();
				const gameTimeNote = gameUtils.getGameTimeNote(game.startTime, currentTime);
				game.gameTime = gameTimeNote;

				let tasks = [];

				tasks.push(AIturn);
				tasks.push(gameModel.update(game._id, game));

				return Promise.all(tasks);
			})
			.spread((AIturn, dbResponse) => {

				if (dbResponse.errors) {
					utils.logDbErrors(dbResponse.errors);
					throw new Error('game update with error');
				}

				return utils.sendResponse(res, AIturn, 201);
			})
			.catch((error) => {
				if (error.message == 'game update with error') return utils.sendErrorResponse(res, error, 500);  //TODO

				return utils.sendErrorResponse(res, error, 401);
			});
	})

	// запрос, что был сделан ход с данными хода юзера
	/*data = {
		accessToken,
		userTurn: {
			currentPosition, 
			targetPosition,
		},
	}*/
	.post(function(req, res) {
		
		return Promise.resolve(true)
			.then(() => {
				if (!req.body.userTurn) throw new Error('no userTurnData in req');

				const headerAuthorization = req.header('Authorization') || '';
				const accessToken = tokenUtils.getTokenFromHeader(headerAuthorization);

				return gameUtils.findCurrentGameByToken(accessToken);
			})
			.then((game) => {
				// инициализация шахматной доски - расстановка актеров на доске
				//const chessboard = new Chessboard(game.boardSize, game.mode, game.actorsData);
				const chessboard = new Chessboard(game, game.actorsData);

				chessboard.setTurn(req.body.userTurn);

				const newActorsData = chessboard.fillActorsDataByActors();
				game.actorsData = newActorsData;
				//??
				game.movesCount++;
				const currentTime = new Date().getTime();
				const gameTimeNote = gameUtils.getGameTimeNote(game.startTime, currentTime);
				game.gameTime = gameTimeNote;

				return gameModel.update(game._id, game);
			})
			.then((dbResponse) => {
				if (dbResponse.errors) {
					utils.logDbErrors(dbResponse.errors);
					throw new Error('game update with error');
				}

				return utils.sendResponse(res, 'userTurn set', 201);
			})
			.catch((error) => {
				if (error.message == 'game update with error') return utils.sendErrorResponse(res, error, 500);  //TODO

				return utils.sendErrorResponse(res, error, 401);
			});
	})
	
	.put(function(req, res) {
		return utils.sendErrorResponse(res, 'UNSUPPORTED_METHOD');
	})
	
	.delete(function(req, res) {
		return utils.sendErrorResponse(res, 'UNSUPPORTED_METHOD');
	})
;

module.exports = router;
