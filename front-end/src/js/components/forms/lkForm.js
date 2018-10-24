
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
const Promise = require('bluebird');

import * as authActions from '../actions/authActions';

// форма для личного кабинета
export default class LkForm extends Component {

	constructor(props) {
		super(props);

		this.defaultGamesInfo = 'У вас пока еще нет игр.';

		this.clickLogoutButton = this.clickLogoutButton.bind(this);
		this.getGamesInfo = this.getGamesInfo.bind(this);
	}

	//TODO: сделать предупреждение о завершении игры
	clickLogoutButton(event) {
		debugger;

		this.props.clickLogoutButton(event);
	}

	/*
		games = [
			{
				isFinished: <Boolean>,
				movesCount:  <Number>,
				totalOfGame: <String>,
				gameTime: <String>,
			}
		]
	 */
	getGamesInfo() {
		debugger;

		if (!this.props.games || !this.props.games.length) return (

			<p>
				{this.defaultGamesInfo}
			</p>
		);

		let games = [];
		let gameKey = 0;

		this.props.games.forEach((game) => {

			const gameState = game.isFinished ? 'завершена' : 'не завершена';
			const gameResult = game.isFinished ? game.totalOfGame : 'пока никто';
			const gameInfo = `${gameKey}) Игра ${gameState}, количество ходов: ${game.movesCount}, длительность игры: ${game.gameTime}, кто победил: ${gameResult}`;
			
			games.push(
				<p key={gameKey} >
					{gameInfo}
				</p>
			);

			gameKey++;
		});

		return games;
	}

	shouldComponentUpdate(nextProps, nextState) {
		
		return (nextProps.className !== this.props.className /*|| nextProps.lkLogout !== this.props.lkLogout*/);
	}
	
	render() {
		console.log('--------render lkForm--------------');

		const lkFormClass = 'lk-form ' + (this.props.className ? this.props.className : '');
		const roleInfo = (this.props.role == 'user') ? 'пользователь' : '';
		const emailInfo = 'Контактный email: ' + this.props.email + ' (' + (this.props.isEmailConfirmed ? '' : 'не ') + 'подтвержден)';
		
		const gamesInfo = this.getGamesInfo();  //??TODO
		//const gamesInfo = this.props.games ? this.props.games : this.defaultGamesInfo;

		const emailConfirmLink = this.props.isEmailConfirmed ? '' : 
		(
			<Link className = 'lk-form__link' to="/emailConfirm">
				Отправить письмо с кодом подтверждения	
			</Link>

		);
			
		return (
			<div className = {lkFormClass}>

				<div className = 'lk-form__title'>Личный кабинет</div>
				
				<div className = 'lk-form__user-info'>

					<p>{this.props.login}</p>
					<p>{roleInfo}</p>
					<p>{emailInfo}</p>

					<p>
						{emailConfirmLink}
					</p>

					<Link className = 'lk-form__link' to="/resetPassword">
						Поменять пароль	
					</Link>

				</div>

				<button className = 'lk-form__button button button_send' onClick = {this.clickLogoutButton}>Выйти</button>

				<div className = 'lk-form__title'>Мои игры</div>

				<div className = 'lk-form__games-info'>
					{gamesInfo}
				</div>

			</div>
		)
	}
}