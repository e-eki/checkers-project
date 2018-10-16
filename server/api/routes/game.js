
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

	// создание игры (при клике на кнопку "Начать игру" на фронтэнде)
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

				user = userData[0];

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
