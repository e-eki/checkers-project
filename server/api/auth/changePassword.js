
const express = require('express');
const Promise = require('bluebird');

const config = require('../../config');
const utils = require('../lib/utils');
const mail = require('../lib/mail');
const tokenUtils = require('../lib/tokenUtils');
const userModel = require('../models/user');

let router = express.Router();

//----- endpoint: /api/changepassword/
router.route('/changepassword/')

	.get(function(req, res) {

		return utils.sendErrorResponse(res, 'UNSUPPORTED_METHOD');
	})

	//запрос на сброс пароля 
	/* data = {
		email: <email>
	}*/
	.post(function(req, res) {

		let user;

		return Promise.resolve(true)
			.then(() => {

				//validate req.body
				if (!req.body.email || req.body.email == '') throw new Error('incorrect changePassword data: empty email');

				const email = req.body.email;

				// ищем юзера с таким имейлом
				return userModel.query({email: email});
			})
			.then((userData) => {

				if (!userData.length) throw new Error('no user with this email');
				
				user = userData[0];

				//для каждого юзера генерится уникальный код сброса пароля и записывается в БД
				const resetPasswordCode = utils.makeUId(user.login + user.email + Date.now());
				user.resetPasswordCode = resetPasswordCode; 

				const data = {
					login: user.login,
					email: user.email,
					resetPasswordCode: user.resetPasswordCode
				};

				//отправляем письмо с кодом сброса пароля на указанный имейл
				return mail.sendResetPasswordLetter(data);
			})
			.then((data) => {

				// если письмо отправилось без ошибок - то записываем код сброса пароля в БД
				return userModel.update(user._id, user);
			})
			.then((dbResponse) => {

				if (dbResponse.errors) throw new Error('resetPasswordCode updated with error');
				return utils.sendResponse(res, 'Reset password mail sent');
			})
			.catch((error) => {

				if (error.message == 'no user with this email') return utils.sendErrorResponse(res, error, 401);  //TODO

				return utils.sendErrorResponse(res, error, 500);
			});
	})

	//изменение пароля юзером на странице сброса пароля (на нее можно перейти из в лк или по ссылке на сброс пароля)
	/*data = {
		accessToken,
		newPassword
	}*/
	.put(function(req, res) {

		let newPassword;

		return Promise.resolve(true)
			.then(() => {

				//validate req.body
				if (!req.body.password || req.body.password == '') throw new Error('incorrect changePassword data: empty newPassword');

				newPassword = req.body.password;

				const headerAuthorization = req.header('Authorization') || '';
				const accessToken = tokenUtils.getTokenFromHeader(headerAuthorization);

				return tokenUtils.findUserByAccessToken(accessToken);
			})
			.then((user) => {

				if (!user.isEmailConfirmed) throw new Error('email not confirmed');

				let tasks = [];

				tasks.push(user);

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
					resetPasswordCode: '',
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

				return utils.sendResponse(res, 'Password changed');
			})
			.catch((error) => {
				//TODO: сделать status внутри error!
				if (error.message == 'password updated with error') return utils.sendErrorResponse(res, error, 500);  

				return utils.sendErrorResponse(res, error, 401);
			});
	})

	.delete(function(req, res) {

		return utils.sendErrorResponse(res, 'UNSUPPORTED_METHOD');
	})
;

//----- endpoint: /api/changepassword/:uuid
router.route('/changepassword/:uuid')

	// сюда приходит запрос на сброс пароля по ссылке из письма
	.get(function(req, res) {

		// ищем юзеров с данным кодом сброса пароля
		return Promise.resolve(userModel.query({resetPasswordCode: req.params.uuid}))
			.then((users) => {

				if (!users.length) throw new Error('no user with this uuid');

				// по идее должен быть один юзер на один код сброса пароля
				const user = users[0];
				user.resetPasswordCode = '';

				let tasks = [];
				tasks.push(user);

				tasks.push(userModel.update(user._id, user));

				return Promise.all(tasks);
			})
			.spread((user, dbResponse) => {

				// редиректим на страницу сброса пароля
				//const mainLink = `${config.server.protocol}://${config.server.host}:${config.server.port}/resetPassword`;
				//return res.redirect(`${mainLink}`);

				// --------- выдаем токены юзеру (редиректит фронт-энд)
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

				// как передать токены, одновременно открыв страницу сброса пароля:
				// передаем аксесс токен как параметр в ссылке, фронт-энд этот параметр извлекает 
				// и использует для запроса на сброс пароля
				// рефреш токен и время жизни ему не нужны, т.к когда истечет время жизни - 
				// протухнет ссылка, и новую можно получить только в новом письме.

				// редиректим на страницу сброса пароля

				const link = `${config.server.protocol}://${config.server.host}:${config.server.port}/resetPassword/${tokensData.accessToken}`;
				return res.redirect(`${link}`);
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