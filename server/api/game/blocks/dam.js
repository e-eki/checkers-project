'use strict';

const Checker = require('./checker');
const moveDirections = require('./moveDirections');

class Dam extends Checker{

    constructor(color, position) {
		super(color, position);
		
		this.type = 'dam';
		this.priority = 5;
		this.directions = moveDirections.dam;
	}
		
};

module.exports = Dam;