
const Promise = require('bluebird');
const axios = require('axios');

const config = require('../../config');
const userModel = require('../models/user');
const utils = require('./utils');

// методы ищут юзера по email при входе через сайт/вк/фб
const authUtils = new function() {

	this.getUserBySiteAuth = function(email, password) {

		//find user with this email
		return Promise.resolve(userModel.query({email: email}))
			.then((userData) => {
				
				if (!userData.length) throw new Error('no user with this email');  //TODO: предложить зарегиться

				let tasks = [];

				tasks.push(userData[0]);
				tasks.push(utils.comparePassword(password, userData[0].password));

				return Promise.all(tasks);
			})
			.spread((user, passwordIsCorrect) => {
				//check password
				if (passwordIsCorrect === false) throw new Error('incorrect password');

				return user;
			})
	};

	this.getUserByVkAuth = function(code) {

		//send request to vk api to get access_token
		return axios.get(
			'https://oauth.vk.com/access_token?'
			, {
				params: {
					client_id: config.vk.clientId
					, client_secret: config.vk.secret
					, code: code
					, redirect_uri: config.vk.redirectUri
				}
			})
			.then((response) => {
				
				//validate vk response
				if (!response.data.email || response.data.email == '') throw new Error('incorrect vk login data: empty user email');

				const userEmail = response.data.email;

				return userModel.query({email: userEmail});
			})
			.then((userData) => {

				if (!userData.length) throw new Error('no user with this email');

				return userData[0];
			})
	};
};

module.exports = authUtils;