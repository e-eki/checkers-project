
const Checker = require('./checker');

class Dam extends Checker{

    constructor(color, position) {

		super();

		this.priority = 5;
		this.directions = ["n", "e", "s", "w"];
	}
		
};

module.exports = Dam;