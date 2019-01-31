'use strict';

const bcrypt = require('bcryptjs');
const Promise = require('bluebird');
const uuidv5 = require('uuid/v5');
const config = require('../../config');

const utils = new function() {

    this.sendResponse = function(res, response, statusCode) {
        let status = statusCode || 200;
        let responseData = response ? response : 'OK'; //??

        return res.status(status).send(responseData);
    };

	this.sendErrorResponse = function(res, error, statusCode) {
        let status = statusCode || error.statusCode || 500;
        if (error == 'UNSUPPORTED_METHOD') status = 404; //???

        let errorMessage = error.message || error || 'error'; //??
        //if (status == 500) errorMessage = 'internal_server_error: ' + errorMessage;   //??

        return res.status(status).send(errorMessage);
    };

    // вычисляет хэш пароля
    this.makePasswordHash = function(password) {
        // оборачиваем в промис вызов функции, тк иначе она промис не возвращает, хоть и асинхронная
        return Promise.resolve(bcrypt.genSalt(config.bcrypt.saltLength))  // генерим соль
            .then((salt) => {
                // берем пароль юзера + соль и генерим хеш
                return bcrypt.hash(password, salt);
            })
    };

    // сравнивает пароль с хэшем пароля из БД
    this.comparePassword = function(password, hash) {
        return Promise.resolve(bcrypt.compare(password, hash));
    };

    //генерирует уникальный идентификатор
    this.makeUId = function(string) {
        return uuidv5(string, uuidv5.URL);   //??
    };

    // логгирует ошибки БД
    this.logDbErrors = function(dbErrors) {
        dbErrors.forEach((error) => {
            console.log('Database error: ' + error.message);
        });
    };
    
};

module.exports = utils;