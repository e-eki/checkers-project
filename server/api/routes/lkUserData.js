
const express = require('express');
const Promise = require('bluebird');

const userModel = require('../models/user');
const utils = require('../lib/utils');
const tokenUtils = require('../lib/tokenUtils');

let router = express.Router();

//----- endpoint: /api/lkUserData/
router.route('/lkUserData')

	//получение данных юзера для личного кабинета
		/*data = {
			accessToken
		}*/
	.get(function(req, res) { 

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

				const lkData = {
					login: user.login,
					email: user.email,
					isEmailConfirmed: user.isEmailConfirmed,
					role: user.role,
				};

				return res.send(lkData);
			})
			.catch((error) => {

				return utils.sendErrorResponse(res, error);
			});
	})

	// метод не поддерживается - пользователь может быть добавлен только через регистрацию
	.post(function(req, res) {
		
		return utils.sendErrorResponse(res, 'UNSUPPORTED_METHOD');
	})
	
	.put(function(req, res) {

		return utils.sendErrorResponse(res, 'UNSUPPORTED_METHOD');
	})
	
	.delete(function(req, res) {

		return utils.sendErrorResponse(res, 'UNSUPPORTED_METHOD');
	})
;

module.exports = router;
