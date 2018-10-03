
const express = require('express');

const config = require('../../config');
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

		const headerAuthorization = req.header('Authorization') || '';
		const accessToken = tokenUtils.getTokenFromHeader(headerAuthorization);

		const newPassword = req.body.newPassword;

		//validate & decode token
		return Promise.resolve(tokenUtils.verifyAccessToken(accessToken))
			.then((result) => {
					
				if (result.error) throw new Error('invalid access token: ' + result.error.message);

				// проверяем, подтверждена ли почта
				return Promise.resolve(userModel.query({id: payload.userId}));
			})
			.then((userData) => {

				if (!userData.length) throw new Error('no user with this email');
				else if (!userData[0].isEmailConfirmed) throw new Error('email not confirmed');

				let tasks = [];

				tasks.push(userData[0]);

				//получаем хэш нового пароля
				tasks.push(utils.makePasswordHash(newPassword));

				// удаляем из БД все рефреш токены юзера, а срок действия его access токена закончится сам
				// после смены пароля надо заново логиниться (?? либо принудительно после того, как закончится access token)
				tasks.push(tokenUtils.deleteAllRefreshTokens(result.payload.userId));

				return Promise.all(tasks);
			})
			.spread((user, hash, data) => {

				const userData = {
					login     : user.login,
					email     : user.email,
					confirmEmailCode: user.confirmEmailCode,
					isEmailConfirmed: user.isEmailConfirmed,
					password     : hash,
					role: user.role,
				};

				return Promise.resolve(userModel.update(user.id, userData));
			})
			.then((dbResponse) => {

				if (dbResponse.errors) throw new Error('password updated with error');

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