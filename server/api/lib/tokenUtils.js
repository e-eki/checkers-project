
const Promise = require('bluebird');
const jwt = require('jsonwebtoken');

const config = require('../../config');
const refreshTokenModel = require('../models/refreshToken');

const tokenUtils = new function() {

	this.getAccessToken = function(user) {

		let payload = {
			userId: user.id,
			userRole: user.role,
		};

		let options = {
			algorithm: 'HS512',
			expiresIn: config.token.access.expiresIn.toString(),
			subject: 'access'
		}

		return jwt.sign(payload, config.token.secret, options);
	};

	this.getAccessTokenExpiresIn = function() {

		let now = new Date().getTime();

		return (now + config.token.access.expiresIn);
	};

	this.getRefreshToken = function(user) {

		let payload = {
			userId: user.id,
		};

		let options = {
			algorithm: 'HS512',
			expiresIn: config.token.refresh.expiresIn.toString(),
			subject: 'refresh'
		}

		return jwt.sign(payload, config.token.secret, options);
	};

	/*this.getRefreshTokenExpiresIn = function() {

		let now = new Date().getTime();

		return (now + config.token.refresh.expiresIn);
	};*/

	this.getTokenFromHeader = function(headerAuthorization) {

		//TODO - Regex?
		const parts = headerAuthorization.split(' ');
		const accessToken = (parts.length && parts[1]) ? parts[1] : '';

		return accessToken;
	};

	this.decodeToken = function(token) {

		let options = {
			json: true,
			complete: true,
		};

		return jwt.decode(token, options);
	},

	// проверяет access token
	this.verifyAccessToken = function(token) {

		return this.verifyToken(token, 'access');
	};

	// проверяет refresh token
	this.verifyRefreshToken = function(token) {

		return this.verifyToken(token, 'refresh');
	}

	//проверяет токен (сигнатуру и срок действия) и возращает декодированный payload, если токен валидный
	this.verifyToken = function(token, tokenType) {

		//проверка на тип токена, записанный в subject
		let subject = (tokenType == 'access') ? 'access' : 'refresh';

		return jwt.verify(token, config.token.secret, {subject: subject}, function(error, payload) {
			
			if (error || tokenType == 'access') return {error: error, payload: payload};   // костыль для заворачивания в промис

			// ищем в БД рефреш токен для этого юзера
			return Promise.resolve(refreshTokenModel.query({userId: payload.userId}))
				.then((refreshToken) => {
					// сравниваем рефреш токены
					//token = token.toString();
					//TODO: как сравнить токены? сравнение строк не работает
					//if (!refreshToken || token > refreshToken[0].toString() || token < refreshToken[0].toString()) throw new Error('bad refresh token');
					if (!refreshToken) throw new Error('bad refresh token');
					else return {error: error, payload: payload};
				})
		});
	};

	// удаляет все рефрештокены из БД для данного юзера
	this.deleteAllRefreshTokens = function(userId) {

		return Promise.resolve(refreshTokenModel.query({userId: userId}))
			.then((refreshTokens) => {
				//find refresh tokens

				if (!refreshTokens.length) return true;

				let tasks = [];
				
				refreshTokens.forEach((token) => {
					tasks.push(refreshTokenModel.delete(token.id));
				})

				return Promise.all(tasks);
			})
			.then((dbResponses) => {

				if (dbResponses == true) return true;

				// log errors
				dbResponses.forEach((dbResponse) => {

					if (dbResponse.errors) {
						dbResponse.errors.forEach((error) => {

							console.log('refresh token saved with error: ' + error.message);
						})
					};
				});

				return true;
			})
	};


};

module.exports = tokenUtils;