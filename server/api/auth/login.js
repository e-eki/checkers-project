
const express = require('express');
const Promise = require('bluebird');

const userModel = require('../models/user');
const refreshTokenModel = require('../models/refreshToken');
const utils = require('../lib/utils');
const tokens = require('../lib/tokens');

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

				if (!userData.length) throw new Error('no user with this email');  //TODO: предложить зарегиться

				let tasks = [];

				tasks.push(userData[0]);
				tasks.push(utils.comparePassword(req.body.password, userData[0].password));

				return Promise.all(tasks);
			})
			.spread((user, passwordIsCorrect) => {

				if (passwordIsCorrect === false) throw new Error('incorrect password');

				let tasks = [];

				tasks.push(user);
				tasks.push(tokens.getAccessToken(user));
				tasks.push(tokens.getAccessTokenExpiresIn());
				tasks.push(tokens.getRefreshToken(user));
				return Promise.all(tasks);
			}) 
			.spread((user, accessToken, accessTokenExpiresIn, refreshToken) => {

				//validate results
				if (!accessToken || accessToken == '') throw new Error('accessToken creates with error');
				if (!refreshToken || refreshToken == '') throw new Error('refreshToken creates with error');

				let tasks = [];

				let refreshTokenData = {
					userId: user.id,
					refreshToken: refreshToken
				};

				tasks.push(refreshTokenModel.create(refreshTokenData));

				let responseData = {
					accessToken: accessToken,
					refreshToken: refreshToken,
					expires_in: accessTokenExpiresIn,
				};

				tasks.push(responseData);

				return Promise.all(tasks);
			})
			.spread((dbResponse, responseData) => {

				if (dbResponse.errors) throw new Error('refresh token saved with error');

				res.send(responseData);
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

