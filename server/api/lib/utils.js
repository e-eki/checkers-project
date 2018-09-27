
const bcrypt = require('bcryptjs');
const Promise = require('bluebird');

const config = require('../../config');

module.exports = {

	sendErrorResponse: function(res, error, statusCode, headers) {

        const status = statusCode || 500;
        const errorMessage = error.message ? error.message : error;

        if (headers) {
            res.set(headers);
        }
        return res.status(status).send(errorMessage);
    },

    makePasswordHash: function(password) {

        let tasks = [];
        tasks.push(bcrypt.genSalt(config.bcrypt.saltLength));   // генерим соль

        return new Promise.all(tasks)
            .then((salt) => {
                // берем пароль юзера + соль и генерим хеш
                return bcrypt.hash(password, salt[0]);
            })
            .then((hash) => {
                
                return hash;
            });

        /*bcrypt.genSalt(10)
            .then((salt) => {
                
                return bcrypt.hash(password, salt);
            })
            .then((hash) => {
                
                return hash;
            })*/
    },
}