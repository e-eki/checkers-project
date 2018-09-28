
const express = require('express');

const utils = require('../lib/utils');
const userModel = require('../models/user');

let router = express.Router();

//----- endpoint: /api/emailconfirm/
router.route('/emailconfirm/')

	.get(function(req, res) {

		return utils.sendErrorResponse(res, 'UNSUPPORTED_METHOD');
	})

	//запрос на повторное подтверждение почты пользователя
	//data? email
	.post(function(req, res) {

		//TODO
		return utils.sendErrorResponse(res, 'UNSUPPORTED_METHOD');
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

		let tasks = [];
		// ищем юзеров с данным кодом подтверждения
		return userModel.query({confirmEmailCode: req.params.uuid})
			.then((users) => {

				if (!users.length) throw new Error('no user with this uuid');

				// по идее должен быть один юзер на один код подтверждения
				const userData = users[0];
				userData.isEmailConfirmed = true;

				// проставляем юзеру флаг подтверждения имейла
				return userModel.update(userData._id, userData);
			})
			.then((data) => {

				res.send(data);
			})
			.catch((error) => {

				return utils.sendErrorResponse(res, error);
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