
const express = require('express');
const Promise = require('bluebird');

const utils = require('../lib/utils');
const tokenUtils = require('../lib/tokenUtils');
const userModel = require('../models/user');
const gameModel = require('../models/game');

let router = express.Router();

//----- endpoint: /api/gameTurn/
router.route('/gameTurn')

	.get(function(req, res) { 

		return utils.sendErrorResponse(res, 'UNSUPPORTED_METHOD');
	})

	// сделать ход
	.post(function(req, res) {
		
		
	})
	
	.put(function(req, res) {

		return utils.sendErrorResponse(res, 'UNSUPPORTED_METHOD');
	})
	
	.delete(function(req, res) {

		return utils.sendErrorResponse(res, 'UNSUPPORTED_METHOD');
	})
;

module.exports = router;
