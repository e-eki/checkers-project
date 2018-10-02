
const Promise = require('bluebird');
const jwt = require('jsonwebtoken');

const config = require('../../config');

module.exports = {

	getAccessToken: function(user) {

		let payload = {
			userId: user.id,
			userRole: user.role,
		};

		let options = {
			algorithm: 'HS512',
			expiresIn: config.token.access.expiresIn.toString()  //???
		}

		return jwt.sign(payload, config.token.secret, options);
	},

	getAccessTokenExpiresIn: function() {

		let now = new Date().getTime();

		return (now + config.token.access.expiresIn);
	},

	getRefreshToken: function(user) {

		let payload = {
			userId: user.id,
		};

		let options = {
			algorithm: 'HS512',
			expiresIn: config.token.refresh.expiresIn.toString()  //???
		}

		return jwt.sign(payload, config.token.secret, options);
	},

	/*getRefreshTokenExpiresIn: function() {

		let now = new Date().getTime();

		return (now + config.token.refresh.expiresIn);
	},*/

	decodeToken: function(token) {

		let options = {
			json: true,
			complete: true,
		};

		return jwt.decode(token, options);
	},

	//проверяет токен (сигнатуру и срок действия) и возращает декодированный payload, если токен валидный
	verifyToken: function(token) {

		return jwt.verify(token, config.token.secret, function(err, payload) {
			
			return {error: err, payload: payload};
		});
	},


};