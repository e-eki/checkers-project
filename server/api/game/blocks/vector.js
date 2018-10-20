
class Vector {

    constructor(x, y) {

		this.x = x;
		this.y = y;
	}

	plus(other) {
		return new Vector(this.x + other.x, this.y + other.y);
	};
	  
	compare(other) {
		if (this.x == other.x && this.y == other.y) return true;
		else return false;
	};
	
	multiply(factor) {
		return new Vector(this.x * factor, this.y * factor);
	};
		
};

module.exports = Vector;