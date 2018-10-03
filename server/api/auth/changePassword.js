
const express = require('express');
const Promise = require('bluebird');

const utils = require('../lib/utils');
const tokenUtils = require('../lib/tokenUtils');
const userModel = require('../models/user');

let router = express.Router();

//----- endpoint: /api/changepassword/
router.route('/changepassword/')

	.get(function(req, res) {

		return utils.sendErrorResponse(res, 'UNSUPPORTED_METHOD');
	})

	.post(function(req, res) {

		return utils.sendErrorResponse(res, 'UNSUPPORTED_METHOD');
	})

	//изменение пароля
	/*data = {
		accessToken,
		newPassword
	}*/
	.put(function(req, res) {

		let newPassword;

		return Promise.resolve(true)
			.then(() => {

				//validate req.body
				if (!req.body.newPassword || req.body.newPassword == '') throw new Error('incorrect login data: empty newPassword');

				newPassword = req.body.newPassword;

				const headerAuthorization = req.header('Authorization') || '';
				const accessToken = tokenUtils.getTokenFromHeader(headerAuthorization);

				//validate & decode token
				return tokenUtils.verifyAccessToken(accessToken)
			})
			.then((result) => {
					
				if (result.error || !result.payload) throw new Error('invalid access token: ' + result.error.message);

				// проверяем, подтверждена ли почта
				return userModel.query({_id: result.payload.userId});
			})
			.then((userData) => {

				if (!userData.length) throw new Error('no user with this email');
				else if (!userData[0].isEmailConfirmed) throw new Error('email not confirmed');

				let tasks = [];

				tasks.push(userData[0]);

				//получаем хэш нового пароля
				tasks.push(utils.makePasswordHash(newPassword));

				return Promise.all(tasks);
			})
			.spread((user, hash) => {

				const userData = {
					login     : user.login,
					email     : user.email,
					confirmEmailCode: user.confirmEmailCode,
					isEmailConfirmed: user.isEmailConfirmed,
					password     : hash,
					role: user.role,
				};

				let tasks = [];

				tasks.push(user.id);
				tasks.push(userModel.update(user.id, userData));

				return Promise.all(tasks);
			})
			.spread((userId, dbResponse) => {

				if (dbResponse.errors) throw new Error('password updated with error');

				// удаляем из БД все рефреш токены юзера, а срок действия его access токена закончится сам
				// после смены пароля надо заново логиниться (?? либо принудительно после того, как закончится access token)
				return tokenUtils.deleteAllRefreshTokens(userId);
			})
			.then(() => {

				res.send('Password changed');
			})
			.catch((error) => {

				return utils.sendErrorResponse(res, error);
			});
	})

	.delete(function(req, res) {

		return utils.sendErrorResponse(res, 'UNSUPPORTED_METHOD');
	})
;

module.exports = router;