'use strict';

const moveDirections = require('./moveDirections');

class Checker {

    constructor(color, position) {
		this.priority = 1;
		this.color = color;
		this.type = 'checker';
		this.position = position;
		this.directions = (color == "white") ? moveDirections.whiteChecker : moveDirections.blackChecker;
	}		
};

module.exports = Checker;