
const express = require('express');
const Promise = require('bluebird');

const utils = require('../lib/utils');
const tokenUtils = require('../lib/tokenUtils');
const userModel = require('../models/user');

let router = express.Router();

//----- endpoint: /api/refreshtokens/
router.route('/refreshtokens/')

	.get(function(req, res) {

		return utils.sendErrorResponse(res, 'UNSUPPORTED_METHOD');
	})

	//обновление обоих токенов
	/*data = {
		refreshToken
	}*/
	.post(function(req, res) {

		return Promise.resolve(true)
			.then(() => {

				const headerAuthorization = req.header('Authorization') || '';
				const refreshToken = tokenUtils.getTokenFromHeader(headerAuthorization);

				//validate & decode token
				return tokenUtils.verifyRefreshToken(refreshToken);
			})
			.then((result) => {
					
				if (result.error || !result.payload) throw new Error('invalid refresh token: ' + result.error.message);

				let tasks = [];

				tasks.push(result.payload.userId);

				// удаляем из БД все рефреш токены юзера (залогиниться можно только с одного устройства единовременно)
				tasks.push(tokenUtils.deleteAllRefreshTokens(result.payload.userId));

				return Promise.all(tasks);
			})
			.spread((userId, dbResponse) => {

				return userModel.query({_id: result.payload.userId});
			})
			.then((user) => {

				if (!user) throw new Error('no user for this refresh token');

				
			})

			.catch((error) => {

				return utils.sendErrorResponse(res, error);
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