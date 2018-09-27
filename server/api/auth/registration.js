
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

				if (emailDuplicates.length) throw new Error('email already exists');
				else if (loginDuplicates.length) throw new Error('login already exists');

				return utils.makePasswordHash(req.body.password);
			})
			.then((hash) => {

				//save new user
				return userModel.create({
					login     : req.body.login,
					email     : req.body.email,
					isEmailConfirmed: false,
					password     : hash,
				});
			})
			.then((data) => {

				//res.send(data);

				return mail.sendConfirmEmailLetter();
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
