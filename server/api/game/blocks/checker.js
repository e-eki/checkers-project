
class Checker {

    constructor(color, position) {

		this.priority = 1;
		this.color = color;
		this.position = position;
		this.directions = (color == "white") ? ["ne", "nw"] : ["se", "sw"];
	}
		
};

module.exports = Checker;