
const bcrypt = require('bcryptjs');
const Promise = require('bluebird');
const uuidv5 = require('uuid/v5');

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

    // вычисляет хэш пароля
    makePasswordHash: function(password) {

        // оборачиваем в промис вызов функции, тк иначе она промис не возвращает, хоть и асинхронная
        return Promise.resolve(bcrypt.genSalt(config.bcrypt.saltLength))  // генерим соль
            .then((salt) => {
                // берем пароль юзера + соль и генерим хеш
                return bcrypt.hash(password, salt);
            })
    },

    // сравнивает пароль с хэшем пароля из БД
    comparePassword: function(password, hash) {

        return Promise.resolve(bcrypt.compare(password, hash));
    },

    //генерирует уникальный идентификатор
    makeUId: function(string) {
        return uuidv5(string, uuidv5.URL);   //??
    },
}