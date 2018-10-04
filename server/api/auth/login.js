
const express = require('express');
const Promise = require('bluebird');

const userModel = require('../models/user');
const refreshTokenModel = require('../models/refreshToken');
const utils = require('../lib/utils');
const tokenUtils = require('../lib/tokenUtils');

let router = express.Router();

//----- endpoint: /api/login/
router.route('/login')

	.get(function(req, res) {

		return utils.sendErrorResponse(res, 'UNSUPPORTED_METHOD');
	})

	/*data = {
		email, password
	}*/
  	.post(function(req, res) {

		return Promise.resolve(true)
			.then(() => {

				//validate req.body
				if (!req.body.email || req.body.email == '') throw new Error('incorrect login data: empty email');
				else if (!req.body.password || req.body.password == '') throw new Error('incorrect login data: empty password');

				return userModel.query({email: req.body.email});
			})
			.then((userData) => {
				//find user with this email
				if (!userData.length) throw new Error('no user with this email');  //TODO: предложить зарегиться

				let tasks = [];

				tasks.push(userData[0]);
				tasks.push(utils.comparePassword(req.body.password, userData[0].password));

				return Promise.all(tasks);
			})
			.spread((user, passwordIsCorrect) => {
				//check password
				if (passwordIsCorrect === false) throw new Error('incorrect password');

				let tasks = [];
				tasks.push(user);

				//удаляем все рефреш токены для данного юзера - можно залогиниться только на одном устройстве, 
				// на других в это время разлогинивается
				tasks.push(tokenUtils.deleteAllRefreshTokens(user.id));

				return Promise.all(tasks);
			})
			.spread((user, data) => {
				// получаем новую пару токенов
				return tokenUtils.getRefreshTokensAndSaveToDB(user);
			})
			.then((tokensData) => {

				res.send(tokensData);
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

