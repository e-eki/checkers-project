
import React, { Component } from 'react';

// панель с инфой
export default class Infobar extends Component {

	constructor(props) {
		super(props);
		
		this.startTime = null;
		this.timer = null;

		this.defaultSettings = {
			gameTime: '0 ч 0 мин',
			startGameDefinition: 'Game start',
			separatingString: '\n' + '\n',
			endGameDefinition: 'End of Game',
		}

		this.state = {
			gameTime: this.defaultSettings.gameTime,
			currentActionDefinition: '',
		};

		this.tick = this.tick.bind(this);
	}

	tick() {

		const currentTime = new Date().getTime();
		const gameTime = currentTime - this.startTime;

		const minute = 1000 * 60;
		const hour = minute * 60;
		const gameHours = Math.round(gameTime / hour);
		const gameMinutes = Math.round((gameTime - gameHours * hour) / minute);

		const gameTimeNote = `${gameHours} ч ${gameMinutes} мин`;

		this.setState({
			gameTime: gameTimeNote,
		});

		/*let newDate = new Date();
		//let newCurrentHours = newDate.getHours() - this.startTime.getHours() + this.state.currentHours;
		//let newCurrentMinutes = newDate.getMinutes() - this.startTime.getMinutes() + this.state.currentMinutes;

		//???
		let newCurrentHours = newDate.getHours() - this.startTime.getHours();
		let newCurrentMinutes = newDate.getMinutes() - this.startTime.getMinutes();

		if (newCurrentHours < 0) newCurrentHours *= -1;
		if (newCurrentMinutes < 0) newCurrentMinutes *= -1;
		
		//this.startTime = newDate;

		this.setState({
			currentHours: newCurrentHours,
			currentMinutes: newCurrentMinutes,
		})*/
	}

	shouldComponentUpdate(nextProps, nextState) {
		// TODO ??
		// перерисовывается каждую минуту для отображения текущего времени и при каждом ходе
		return (
				nextState.currentHours!== this.state.currentHours ||
				nextState.currentMinutes!== this.state.currentMinutes ||
				nextProps.currentActionDefinition !== this.state.currentActionDefinition ||
				nextProps.startOfGame !== this.props.startOfGame ||
				nextProps.isUserTurn !== this.props.isUserTurn ||
				nextProps.whiteActorsCount !== this.props.whiteActorsCount ||
				nextProps.blackActorsCount !== this.props.blackActorsCount	
			);
	}
	
	componentWillUpdate(nextProps, nextState) {

		if (nextProps.startOfGame && !this.props.startOfGame) {
			this.startTime = new Date().getTime();
			this.timer = setInterval(this.tick, 60000);

			this.state.currentActionDefinition = this.defaultSettings.startGameDefinition;
		}
		else if (!nextProps.startOfGame && this.props.startOfGame) {
			clearInterval(this.timer);

			this.state.currentActionDefinition += this.defaultSettings.separatingString + this.defaultSettings.endGameDefinition;
		}
		else if (!nextProps.endOfGame && this.props.endOfGame) {

			this.state.gameTime = this.defaultSettings.gameTime;
			this.state.currentActionDefinition = '';
		}

		if (nextProps.currentActionDefinition !== this.props.currentActionDefinition) {
			this.state.currentActionDefinition += this.defaultSettings.separatingString + nextProps.currentActionDefinition;
		}
	}

	componentWillUnmount() {

		clearInterval(this.timer);
	}

	// TODO!! - возвращать время в gamePage для отображения на табло (и отправки на сервер для записи в данные об игре)
    render() {

		console.log('render infobar');

		let whoTurns = (this.props.startOfGame || this.props.endOfGame) ? (this.props.isUserTurn ? 'ваш' : 'противника') : '-';
		//let currentTime = this.state.currentHours + ' ч ' + this.state.currentMinutes + ' мин ';

        return (
			<div className ="bar bar_info">
				<div>Сейчас ход: <span>{whoTurns}</span></div>
				<div>Прошло времени: <p ref={elem => this.time = elem}>{this.state.gameTime}</p></div>
				<div>Сделано ходов: <span>{this.props.movesCount}</span></div>
				<div>Белые фигуры на доске: <span>{this.props.whiteActorsCount}</span></div>
				<div>Черные фигуры на доске: <span>{this.props.blackActorsCount}</span></div>
				<div>История ходов: 
					<textarea readOnly = {true} value = {this.state.currentActionDefinition}></textarea>
				</div>				
			</div>
        )
    }
}
