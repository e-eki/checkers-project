'use strict';

const express = require('express');
const config = require('../../config');
const utils = require('../lib/utils');
const mail = require('../lib/mail');
const userModel = require('../models/user');

let router = express.Router();

//----- endpoint: /api/emailconfirm/
router.route('/emailconfirm/')

	.get(function(req, res) {
		return utils.sendErrorResponse(res, 'UNSUPPORTED_METHOD');
	})

	//запрос на повторное подтверждение почты пользователя
	/* data = {
		email: <email>
	}*/
	.post(function(req, res) {

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

				if (user.isEmailConfirmed) return true; // если имейл уже подтвержден

				const data = {
					login: user.login,
					email: user.email,
					confirmEmailCode: user.confirmEmailCode
				};

				//отправляем письмо с кодом подтверждения на указанный имейл
				return mail.sendConfirmEmailLetter(data);
			})
			.then((data) => {

				// если имейл уже подтвержден
				if (data === true) return utils.sendResponse(res, 'Email already confirmed');

				return utils.sendResponse(res, 'Confirm mail sent again');
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

//----- endpoint: /api/emailconfirm/:uuid
router.route('/emailconfirm/:uuid')
	// сюда приходит запрос на подтверждение имейла по ссылке из письма
	.get(function(req, res) {
		// ищем юзеров с данным кодом подтверждения
		return userModel.query({confirmEmailCode: req.params.uuid})
			.then((users) => {
				if (!users.length) throw new Error('no user with this uuid');

				// по идее должен быть один юзер на один код подтверждения
				const userData = users[0];
				// если уже переходили по ссылке
				if (userData.isEmailConfirmed) return true;
				userData.isEmailConfirmed = true;
				// проставляем юзеру флаг подтверждения имейла
				return userModel.update(userData._id, userData);
			})
			.then((usedLink) => {
				// если по ссылке уже переходили, то редиректим на главную
				if (usedLink === true) {

					const mainLink = `${config.server.protocol}://${config.server.host}:${config.server.port}`;
					return res.redirect(`${mainLink}`);
				};
				//если нет, то показываем страницу успешного подтверждения
				//TODO: ?? как сделать редирект на главную через неск.секунд после показа страницы?
				const page = require('../templates/successConfirmPage');
				res.set('Content-Type', 'text/html');

				return res.send(page);
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