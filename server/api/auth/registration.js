
const express = require('express');
const Promise = require('bluebird');

const userModel = require('../models/user');
const utils = require('../lib/utils');
const mail = require('../lib/mail');

let router = express.Router();

//----- endpoint: /api/registration/
router.route('/registration')

	.get(function(req, res) {

		return utils.sendErrorResponse(res, 'UNSUPPORTED_METHOD');
	})

  	.post(function(req, res) {

		let userData;

		//validate req.body
		if (!req.body.email || req.body.email == '') throw new Error('incorrect registration data: empty email');
		else if (!req.body.login || req.body.login == '') throw new Error('incorrect registration data: empty login');
		else if (!req.body.password || req.body.password == '') throw new Error('incorrect registration data: empty password');

		//check email & login duplicates
		let tasks = [];
		tasks.push(userModel.query({email: req.body.email}));
		tasks.push(userModel.query({login: req.body.login}));
		
		return Promise.all(tasks)
			.spread((emailDuplicates, loginDuplicates) => {

				// если занят логин, то выбрасываем ошибку
				if (loginDuplicates.length) throw new Error('login already exists');

				let tasks = [];

				// если занято мыло, то проверяем - подтверждено ли, если да, то выбрасываем ошибку, что оно занято
				// если нет, то выбрасываем ошибку, что оно занято - надо подтвердить
				if (emailDuplicates.length) {
					
					if (emailDuplicates[0].isEmailConfirmed) throw new Error('email already exists');
					else return utils.sendErrorResponse(res, error, 403);
				}

				return utils.makePasswordHash(req.body.password);
			})
			.then((hash) => {

				//для каждого юзера генерится уникальный код подтверждения и записывается в БД
				// (при повторной отправке подтверждения на имейл код подтверждения берется этот же)
				const confirmEmailCode = utils.makeUId(req.body.login + req.body.email + Date.now());  

				userData = {
					login     : req.body.login,
					email     : req.body.email,
					confirmEmailCode: confirmEmailCode,
					isEmailConfirmed: false,
					password     : hash,
					firstName: req.body.firstName,
				};

				//save new user
				return userModel.create(userData);
			})
			.then((data) => {
				//отправляем письмо с кодом подтверждения на указанный имейл
				return mail.sendConfirmEmailLetter(userData);
			})
			.catch((error) => {
                // возможную ошибку на этапе отправки письма игнорируем - только логируем ее
                console.log('email error: ', error.message);
                return null;
            })
			.then((data) => {

				res.send(data);
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
