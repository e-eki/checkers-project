
const express = require('express');

const userModel = require('../models/user');
const utils = require('../lib/utils');

let router = express.Router();

//----- endpoint: /api/user/
router.route('/user')

  // метод не поддерживается - всех пользователей получить не можем
  .get(function(req, res) { 

    return utils.sendErrorResponse(res, 'UNSUPPORTED_METHOD');
  })

  // метод не поддерживается - пользователь может быть добавлен только через регистрацию
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

//----- endpoint: /api/user/:id
router.route('/user/:id')

  // получение юзера по его id
  .get(function(req, res) {   
    userModel.query(req.params.id)
      .then((data) => {
        res.send(data)
      });
  })

  .post(function(req, res) {

		return utils.sendErrorResponse(res, 'UNSUPPORTED_METHOD');
	})

  // редактирование данных юзера по его id
  .put(function(req, res) {
    userModel.update(req.params.id, req.body)
      .then((data) => {
        res.send(data)
      });
  })

  .delete(function(req, res) {
    /*userModel.delete(req.params.id)
      .then((data) => {
        res.send(data)
      })
      .catch((error) => {
        res.send(error);
      })*/

      return utils.sendErrorResponse(res, 'UNSUPPORTED_METHOD');
  })
;

module.exports = router;
