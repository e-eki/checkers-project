
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// панель настроек
export default class Toolbar extends Component {

	constructor(props){
		super(props);
		   
		this.switchStartHandle = this.switchStartHandle.bind(this);
		this.changeData = this.changeData.bind(this);
		this.resetHandle = this.resetHandle.bind(this);
	}

	// начало/завершение игры
	switchStartHandle(event) {
		//event.preventDefault();

		// вызывает событие в родителе - дисплее
		this.props.switchStartGame(event);	
	}
	
	// событие изменения настроек
	changeData(event) {

		console.log(event.target.name, event.target.value);
		// вызывает событие в родителе - дисплее
		if (event.target.name == 'quotesSwitchedOff') {
			this.props.updateData(event.target.name, !this.props.quotesSwitchedOff);	
		}
		else {
			this.props.updateData(event.target.name, event.target.value);
		}			
	}

	resetHandle(event) {
		//event.preventDefault();

		// вызывает событие в родителе - дисплее
		this.props.resetDefaultSettings();	
	}

	shouldComponentUpdate(nextProps, nextState) {
		
		return (
				nextProps.quotesSwitchedOff !== this.props.quotesSwitchedOff ||
				nextProps.userColor !== this.props.userColor || 
				nextProps.boardSize !== this.props.boardSize ||
				nextProps.level !== this.props.level || 
				nextProps.mode !== this.props.mode ||
				(nextProps.startOfGame && !this.props.startOfGame) || 
				(!nextProps.endOfGame && this.props.endOfGame)
			);			
    }

	render() {
		console.log('render toolbar');

		let elementIsDisabled;
		let itemClass;
		let switchStartBtnText;
		let switchStartBtnClass;

		if (!this.props.startOfGame && !this.props.endOfGame) {
			elementIsDisabled = false;
			itemClass = 'bar_enabled-item';
			switchStartBtnText = 'Начать игру';
			switchStartBtnClass = 'button_start';
		}
		else {
			elementIsDisabled = true;
			itemClass = 'bar_disabled-item';
			switchStartBtnText = 'Завершить игру';
			switchStartBtnClass = 'button_finish';
		}

		return (
			<div className = "bar bar_tools">
				
					<Link to="/login">Вход</Link>
					<Link to="/registration">Регистрация</Link>

					<div>
						<input name = "quotesSwitchedOff" type="checkbox" className = 'bar_enabled-item' checked = {this.props.quotesSwitchedOff} onChange = {this.changeData}/>
						Выключить цитаты
					</div>
					<div>
						Выберите цвет ваших фигур: 
						<select name="userColor" className = {itemClass} disabled = {elementIsDisabled} onChange = {this.changeData} value = {this.props.userColor}>
							<option value="white">белые</option>
							<option value="black">черные</option>
						</select>
					</div>
					<div>
						Выберите размер доски:<span>{this.props.boardSize}</span>
						<input 
							name = "boardSize" 
							type = "range" 
							min = "4" 
							max = "14" 
							step = "2" 
							value = {this.props.boardSize} 
							className = {itemClass}
							disabled = {elementIsDisabled} 
							onChange = {this.changeData}
						/>
						
					</div>
					<div>
						Выберите уровень сложности: 
						<select name="level" className = {itemClass} disabled = {elementIsDisabled} onChange = {this.changeData} value = {this.props.level}>
							<option value="easy">легкий</option>
							<option value="medium">средний</option>
							<option value="hard">сложный</option>
							<option value="randomize">randomize</option>
						</select>
					</div>
					<div>
						Выберите режим игры: 
						<select name="mode" className = {itemClass} disabled = {elementIsDisabled} onChange = {this.changeData} value = {this.props.mode}>>
							<option value="classic">классический</option>
							<option value="dam">играть только дамками</option>
						</select>
					</div>
					<button name = "resetBtn" className = {'bar__button button ' + itemClass} disabled = {elementIsDisabled} onClick = {this.resetHandle}>
						Настройки по умолчанию
					</button>
					<button name = "switchStartBtn" className = {'bar__button button bar_enabled-item ' + switchStartBtnClass} onClick = {this.switchStartHandle}>
						{switchStartBtnText}
					</button>
				
			</div>
		)
	}
}
