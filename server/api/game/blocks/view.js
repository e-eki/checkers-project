'use strict';

const moveDirections = require('./moveDirections');
//const chessboard = require('./chessboard');

class View {

    constructor(actor, chessboard) {
		this.actor = actor;
		this.chessboard = chessboard;	
	}

	/*find() {

		const actions = this.findAll();
	
		const action = this.chooseActionFromPossible(actions);

		return action;
	};

	chooseActionFromPossible(actions) {

		if (!actions.length) return null;
	
		const maxPriorityAction = actions.reduce(function(min, cur) {
			if (cur.priority > min.priority) return cur;
			else return min;
		});

		return maxPriorityAction;
	}*/

	look(vector) {  
		if (this.chessboard.isInside(vector))
			return this.chessboard.get(vector);
		else
		  return null;
	};

	findAll() {
		let actions = [];
	
		// для каждого направления данного актера считаем вектор и для него считаем приоритет и тип (есть/двигаться/null)
		this.actor.directions.forEach(function(direction) {

			const vector = this.actor.position.plus(moveDirections.all[direction]);
			const element = this.look(vector);
  
			// если element не null, то данный вектор не выходит за пределы доски
			if (element) {
				// для простой шашки считаем по одному вектору для каждого направления
				const action = this.getActionForVector(vector, element);
				// если тип не равен null, значит, на клетку можно переместиться, и добавляем ее в массив возможных направлений
				if (action.type) actions.push(action);
			}
		}.bind(this));

		return actions;
	};

	getActionForVector(vector, element) {
		let type = null;
		let priority = 0;
		  
		// если клетка пустая, то тип "двигаться"
		if (element.priority == 0) {   
			type = "move";
		}
		// если на клетке фигура другого цвета, то тип "есть"
		else if (element.priority > 0 && element.color !== this.actor.color) {
			type = "eat";
		}

		if (element.priority > 0 && element.color !== this.actor.color) {
			priority += element.priority + this.actor.priority;
		}

		const action = {
			actor: this,
			currentPosition: this.actor.position,
			targetPosition: vector,

			type: type,
			priority: priority,
		}

		return action;
	}		
};

module.exports = View;