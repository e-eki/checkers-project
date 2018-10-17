
import React, { Component } from 'react';

// панель с инфой
export default class Infobar extends Component {

	constructor(props) {
		super(props);
		
		this.startTime = null;
		this.timer = null;

		this.defaultSettings = {
			currentHours: 0,
			currentMinutes: 0,
			startGameDefinition: 'Game start',
			separatingString: '\n' + '\n',
			endGameDefinition: 'End of Game',
		}

		this.state = {
			currentHours: this.defaultSettings.currentHours,
			currentMinutes: this.defaultSettings.currentMinutes,
			currentActionDefinition: ''
		};

		this.tick = this.tick.bind(this);
	}

	tick() {

		let newDate = new Date();
		//let newCurrentHours = newDate.getHours() - this.startTime.getHours() + this.state.currentHours;
		//let newCurrentMinutes = newDate.getMinutes() - this.startTime.getMinutes() + this.state.currentMinutes;

		//???
		let newCurrentHours = newDate.getHours() - this.startTime.getHours();
		let newCurrentMinutes = newDate.getMinutes() - this.startTime.getMinutes();
		if (newCurrentMinutes < 0) 
			newCurrentMinutes = newCurrentMinutes * (-1);
		
		//this.startTime = newDate;

		this.setState({
			currentHours: newCurrentHours,
			currentMinutes: newCurrentMinutes,
		})
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
			this.startTime = new Date();
			this.timer = setInterval(this.tick, 60000);

			this.state.currentActionDefinition = this.defaultSettings.startGameDefinition;
		}
		else if (!nextProps.startOfGame && this.props.startOfGame) {
			clearInterval(this.timer);

			this.state.currentActionDefinition += this.defaultSettings.separatingString + this.defaultSettings.endGameDefinition;
		}
		else if (!nextProps.endOfGame && this.props.endOfGame) {

			this.state.currentHours = this.defaultSettings.currentHours;
			this.state.currentMinutes = this.defaultSettings.currentMinutes;
			this.state.currentActionDefinition = '';
		}

		if (nextProps.currentActionDefinition !== this.props.currentActionDefinition) {
			this.state.currentActionDefinition += this.defaultSettings.separatingString + nextProps.currentActionDefinition;
		}
	}

	componentWillUnmount() {

		clearInterval(this.timer);
	}

    render() {
		console.log('render infobar');

		let whoTurns = (this.props.startOfGame || this.props.endOfGame) ? (this.props.isUserTurn ? 'ваш' : 'противника') : '-';
		let currentTime = this.state.currentHours + ' ч ' + this.state.currentMinutes + ' мин ';

        return (
			<div className ="bar bar_info">
				<div>Сейчас ход: <span>{whoTurns}</span></div>
				<div>Прошло времени: <p ref={elem => this.time = elem}>{currentTime}</p></div>
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
