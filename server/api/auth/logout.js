
const express = require('express');
const Promise = require('bluebird');

const userModel = require('../models/user');
const refreshTokenModel = require('../models/refreshToken');
const utils = require('../lib/utils');
const tokens = require('../lib/tokens');

let router = express.Router();

//----- endpoint: /api/logout/
router.route('/logout')

	.get(function(req, res) {

		return utils.sendErrorResponse(res, 'UNSUPPORTED_METHOD');
	})

  	.post(function(req, res) {

		return utils.sendErrorResponse(res, 'UNSUPPORTED_METHOD');
	})

	.put(function(req, res) {

		return utils.sendErrorResponse(res, 'UNSUPPORTED_METHOD');
	})

	//data = accessToken
	.delete(function(req, res) {

		const headerAuthorization = req.header('Authorization') || '';

		//TODO - Regex
		const parts = headerAuthorization.split(' ');
		const token = parts[1];
		
		//validate token
		return Promise.resolve(tokens.verifyToken(token))
			.then((result) => {
				
				if (result.error) throw new Error('invalid token: ' + result.error.message);

				return refreshTokenModel.query({userId: result.payload.userId});
			})
			.then((refreshTokens) => {

				if (!refreshTokens.length) return true;

				let tasks = [];
				console.log(refreshTokens[0].id);
				
				refreshTokens.forEach((token) => {
					tasks.push(refreshTokenModel.delete(token.id));
				})

				return Promise.all(tasks);
			})
			.then((data) => {

				res.send('User is logged out' );
			})
			.catch((error) => {

				return utils.sendErrorResponse(res, error);
			})

	})
;

module.exports = router;

