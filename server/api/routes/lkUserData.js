
const express = require('express');
const Promise = require('bluebird');

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

				return tokenUtils.findUserByAccessToken(accessToken);
			})
			.then((user) => {

				const lkData = {
					login: user.login,
					email: user.email,
					isEmailConfirmed: user.isEmailConfirmed,
					role: user.role,
				};

				return utils.sendResponse(res, lkData);
			})
			.catch((error) => {

				return utils.sendErrorResponse(res, error, 401);
			});
	})

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
