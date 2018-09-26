
const express = require('express');

const userModel = require('../models/user');
const utils = require('../lib/utils');

let router = express.Router();

//----- endpoint: /api/user/
router.route('/user')

  .get(function(req, res) { 

    userModel.query()
      .then((data) => {
        res.send(data)
      });
  })

  .post(function(req, res) {
    userModel.create(req.body)
      .then((data) => {
        res.send(data)
      });
  })
  
  .put(function(req, res) {

		return utils.sendErrorResponse(res, 'UNSUPPORTED_METHOD');
  })
  
  .delete(function(req, res) {

		return utils.sendErrorResponse(res, 'UNSUPPORTED_METHOD');
	})
;

router.route('/user/:id')

  .get(function(req, res) {   
    userModel.query(req.params.id)
      .then((data) => {
        res.send(data)
      });
  })

  .post(function(req, res) {

		return utils.sendErrorResponse(res, 'UNSUPPORTED_METHOD');
	})

  .put(function(req, res) {
    userModel.update(req.params.id, req.body)
      .then((data) => {
        res.send(data)
      });
  })

  .delete(function(req, res) {
    userModel.delete(req.params.id)
      .then((data) => {
        res.send(data)
      })
      .catch((error) => {
        res.send(error);
      })
  })

module.exports = router;
