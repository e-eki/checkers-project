
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

	.get(function(req, res) { 

		return utils.sendErrorResponse(res, 'UNSUPPORTED_METHOD');
	})

	// запрос, что был сделан ход с данными хода юзера - в ответ отправляется ход ИИ
	/*data = {
		accessToken,
		userTurn: < >,
	}*/
	.post(function(req, res) {
		
		return Promise.resolve(true)
			.then(() => {

				const headerAuthorization = req.header('Authorization') || '';
				const accessToken = tokenUtils.getTokenFromHeader(headerAuthorization);

				return gameUtils.findCurrentGameByToken(accessToken);
			})
			.then((game) => {

				// инициализация шахматной доски - расстановка актеров на доске
				const chessboard = new Chessboard(game.boardSize, game.mode, game.actorsData);
				
				chessboard.test();


			

				return utils.sendResponse(res, 'game successfully saved', 201);
			})
			.catch((error) => {
				if (error.message == 'game saved with error') return utils.sendErrorResponse(res, error, 500);  //TODO

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
