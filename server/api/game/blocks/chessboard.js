'use strict';

const Promise = require('bluebird');
const Vector = require('./vector');
const Cell = require('./cell');
const Checker = require('./checker');
const Dam = require('./dam');
const View = require('./view');

class Chessboard {
	
	constructor(gameData, actorsData) {
		this.boardSize = gameData.boardSize;
		this.userColor = gameData.userColor;
		this.level = gameData.level;
		this.mode = gameData.mode;
		this.actorsData = [];
		this.grid = [];   
		this.actors = [];  
		
		this.actorsData = (actorsData !== undefined) ? actorsData : this.fillStartActorsData();
		this.grid = this.fillGrid();   //??
		this.actors = this.fillActorsByActorsData();  //??
	}

	fillGrid() {

		let grid = [];

		for (var y = 0; y < this.boardSize; y++) {

			grid[y] = [];

			for (var x = 0; x < this.boardSize; x++) {

				const color = (y + x) % 2 == 0 ? 'white' : 'black';
				grid[y].push(new Cell(color));
			}
		}

		return grid;
	}
	
	// массив с данными актеров
	fillStartActorsData() {

		let actorsData = [];

		const firstRowWhite = this.boardSize/2 + 1; 
		const lastRowWhite = this.boardSize - 1;
		const firstRowBlack = 0;
		const lastRowBlack = this.boardSize/2 - 2;

		for (let y = 0; y < this.boardSize; y++) {

			//actorsData[y] = [];
		
			for (let x = 0; x < this.boardSize; x++) {

				// актеры могут быть только на черных клетках
				if ((y + x) % 2 !== 0) {

					let actorColor = null;
					// определяем цвет актера
					if (y >= firstRowWhite && y <= lastRowWhite) {
						actorColor = 'white';
					}
					else if (y >= firstRowBlack && y <= lastRowBlack) {
						actorColor = 'black';
					}

					// если есть цвет, то есть актер на данной клетке
					if (actorColor) {

						let actorType = (this.mode == 'classic') ? 'checker' : 'dam';  //TODO

						/*actorsData[y].push({

							color: actorColor,
							type: actorType,
							x: x,
							y: y  
						});*/

						actorsData.push({
							color: actorColor,
							type: actorType,
							x: x,
							y: y
						});
					}
					/*else {
						actorsData.push(null);
					}*/
				}
				/*else {
					actorsData.push(null);
				}*/
			}
		}

		return actorsData;
	}

	// actors - массив с данными актеров
	fillActorsByActorsData() {

		let actors = [];

		/*for (let y = 0; y < this.boardSize; y++) {

			actors[y] = [];
		
			for (let x = 0; x < this.boardSize; x++) {

				if (this.actorsData[y][x]) {

					const position = new Vector(x, y);
					const color = this.actorsData[y][x].color;
					const actor = (this.actorsData[y][x].type == 'checker') ? (new Checker(color, position)) : (new Dam(color, position));

					actors[y].push(actor);
				}
				else {
					actors[y].push(null);
				}
			}
		}*/

		this.actorsData.forEach(function(actorData) {

			const position = new Vector(actorData.x, actorData.y);
			const color = actorData.color;
			const actor = (actorData.type == 'checker') ? (new Checker(color, position)) : (new Dam(color, position));

			actors.push(actor);
		}.bind(this));

		return actors;
	}

	fillActorsDataByActors() {

		let actorsData = [];

		this.actors.forEach(function(actor) {

			actorsData.push({
				color: actor.color,
				type: actor.type,
				x: actor.position.x,
				y: actor.position.y
			});

		}.bind(this));

		return actorsData;
	}

	isInside(vector) {

		return (vector.x >= 0 && vector.x < this.boardSize) && (vector.y >= 0 && vector.y < this.boardSize);
	};
	
	find(position) {

		let actor = this.actors.filter((actor) => {  
			return actor.position.compare(position) == true;
		});

		if (actor.length) return actor[0];
		else return null;
	}
	
	get(position) {

		let actor = this.find(position); 

		return actor || this.grid[position.y][position.x];
	};
	
	set(position, destination) {

		let actor = this.find(position);

		if (actor) actor.position = destination;
	};
	
	add(actor) {

		this.actors.push(actor);
	};
	
	delete(position) { 

		let actor = this.find(position);

		if (actor) {
		  const index = this.actors.indexOf(actor);
		  this.actors = this.actors.slice(0, index).concat(this.actors.slice(index + 1));
		}
	};

	/* turnData = {
		currentPosition, 
		targetPosition
	}*/ 
	setTurn(turnData) { 
		
		const currentVector = new Vector(turnData.currentPosition.x, turnData.currentPosition.y);
		const targetVector = new Vector(turnData.targetPosition.x, turnData.targetPosition.y);

		this.delete(targetVector);

		this.set(currentVector, targetVector);
	}

	getAIturn() {
		
		let possibleActions = []; 

		this.actors.forEach(function(actor) {

			if (actor.color !== this.userColor) {

				const actorView = new View(actor, this);

				const actorActions = actorView.findAll();
				const actorAction = this.chooseActionFromPossible(actorActions);

				if (actorAction) possibleActions.push(actorAction);
			}
		}.bind(this));
	
		const action = this.chooseActionFromPossible(possibleActions);

		return action;
	};

	chooseActionFromPossible(actions) {

		if (!actions.length) return null;
	
		const maxPriorityAction = actions.reduce(function(min, cur) {
			if (cur.priority > min.priority) return cur;
			else return min;
		});

		return maxPriorityAction;
	}

};

module.exports = Chessboard;
