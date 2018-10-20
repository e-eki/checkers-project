
const Promise = require('bluebird');

const Vector = require('./vector');
const Cell = require('./cell');
const Checker = require('./checker');
const Dam = require('./dam');

class Chessboard {
	
	constructor(boardSize, mode, actorsData) {

		this.boardSize = boardSize;
		this.mode = mode;
		this.actorsData = [];
		this.grid = [];   //??
		this.actors = [];  //??
		
		this.actorsData = (actorsData !== undefined) ? actorsData : this.fillActorsData();
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
	
	fillActorsData() {

		let actorsData = [];

		const firstRowWhite = this.boardSize/2 + 1; 
		const lastRowWhite = this.boardSize - 1;
		const firstRowBlack = 0;
		const lastRowBlack = this.boardSize/2 - 2;

		for (let y = 0; y < this.boardSize; y++) {

			actorsData[y] = [];
		
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

						let actorType = (this.mode == 'classic') ? 'checker' : 'dam';

						actorsData[y].push({

							color: actorColor,
							type: actorType,
							x: x,
							y: y  
						});
					}
					else {
						actorsData[y].push(null);
					}
				}
				else {
					actorsData[y].push(null);
				}
			}
		}

		return actorsData;
	}

	fillActorsByActorsData() {

		let actors = [];

		for (let y = 0; y < this.boardSize; y++) {

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
		}

		return actors;
	}


};

module.exports = Chessboard;
