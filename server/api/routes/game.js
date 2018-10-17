
const express = require('express');
const Promise = require('bluebird');

const utils = require('../lib/utils');
const tokenUtils = require('../lib/tokenUtils');
const userModel = require('../models/user');
const gameModel = require('../models/game');

let router = express.Router();

//----- endpoint: /api/game/
router.route('/game')

	.get(function(req, res) { 

		return utils.sendErrorResponse(res, 'UNSUPPORTED_METHOD');
	})

	// создание-начало игры (при клике на кнопку "Начать игру" на фронтэнде)
	/*data = {
		accessToken,
		userColor: < цвет фигур юзера >,
		boardSize: < размер доски >,
		level: < уровень сложности >,
		mode: < режим игры >,
	}*/
	.post(function(req, res) {
		
		return Promise.resolve(true)
			.then(() => {

				const headerAuthorization = req.header('Authorization') || '';
				const accessToken = tokenUtils.getTokenFromHeader(headerAuthorization);

				//validate & decode token
				return tokenUtils.verifyAccessToken(accessToken)
			})
			.then((result) => {
					
				if (result.error || !result.payload) throw new Error('invalid access token: ' + result.error.message);

				// get user
				return userModel.query({_id: result.payload.userId});
			})
			.then((userData) => {

				if (!userData.length) throw new Error('no user with this access token');

				let user = userData[0];

				const gameData = {
					userId:  user._id,
					isFinished  :  false,
					movesCount:  0,   //??
					totalOfGame: 'standoff',   //??

					userColor: req.body.userColor,
					boardSize: req.body.boardSize,
					level: req.body.level,
					mode: req.body.mode,
					actorsData: [],    //??
				};

				return gameModel.create(gameData);

			})
			.then((dbResponse) => {

				if (dbResponse.errors) {

					// log errors
					dbResponse.errors.forEach((error) => {
						console.log('game saved with error: ' + error.message);
					});

					// ? если в БД не удалось сохранить игру - то ошибка, надо повторить всё сначала
					throw new Error('game saved with error');
				}

				return utils.sendResponse(res, 'game successfully saved', 201);
			})
			.catch((error) => {
				if (error.message == 'game saved with error') return utils.sendErrorResponse(res, error, 500);  //TODO

				return utils.sendErrorResponse(res, error, 401);
			});
	})
	
	// завершение игры (при клике на кнопку "Завершить игру"/логауте во время игры)
	/*data = {
		accessToken,
		movesCount: < количество ходов >,
		totalOfGame: < результат игры - кто выиграл >,
	}*/
	.put(function(req, res) {

		return Promise.resolve(true)
			.then(() => {

				const headerAuthorization = req.header('Authorization') || '';
				const accessToken = tokenUtils.getTokenFromHeader(headerAuthorization);

				//validate & decode token
				return tokenUtils.verifyAccessToken(accessToken)
			})
			.then((result) => {
					
				if (result.error || !result.payload) throw new Error('invalid access token: ' + result.error.message);

				// get user
				return userModel.query({_id: result.payload.userId});
			})
			.then((userData) => {

				if (!userData.length) throw new Error('no user with this access token');

				const user = userData[0];

				let tasks = [];

				tasks.push(user);
				// get game
				tasks.push(gameModel.findUserUnfinishedGames(user._id));

				return Promise.all(tasks);
			})
			.spread((user, games) => {

				if (!games.length) throw new Error('no unfinished games for this user');

				//по идее должна быть только одна (или ни одной) незаконченная игра для каждого юзера
				const game = games[0];

				const gameData = {
					userId:  game.userId,
					isFinished  :  true,
					movesCount:  req.body.movesCount,
					totalOfGame: req.body.totalOfGame,

					userColor: game.userColor,
					boardSize: game.boardSize,
					level: game.level,
					mode: game.mode,
					actorsData: game.actorsData,    //??
				};

				return gameModel.update(game._id, gameData);
			})
			.then((dbResponse) => {

				if (dbResponse.errors) {

					// log errors
					dbResponse.errors.forEach((error) => {
						console.log('game update with error: ' + error.message);
					});

					// ? если в БД не удалось сохранить игру - то ошибка, надо повторить всё сначала
					throw new Error('game update with error');
				}

				return utils.sendResponse(res, 'game successfully update');
			})
			.catch((error) => {
				if (error.message == 'game update with error') return utils.sendErrorResponse(res, error, 500);  //TODO

				return utils.sendErrorResponse(res, error, 401);
			});
	})
	
	.delete(function(req, res) {

		return utils.sendErrorResponse(res, 'UNSUPPORTED_METHOD');
	})
;

module.exports = router;
