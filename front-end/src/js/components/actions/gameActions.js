
import axios from 'axios';
const Promise = require('bluebird');

import apiConst from '../apiConst';

export function startGameAction(accessToken, userColor, boardSize, level, mode) {
	debugger;

	const params = {
		userColor: userColor,
		boardSize: boardSize,
		level: level,
		mode: mode,
	};

	const options = {
		method: 'POST',
		headers: { 'Authorization': `Token ${accessToken}` },
		data: params,
		url: `${apiConst.gameApi}`
	};
	
	return axios(options);
};

export function finishGameAction(accessToken, movesCount, totalOfGame) {
	debugger;

	const params = {
		movesCount: movesCount,
		totalOfGame: totalOfGame,
	};

	const options = {
		method: 'PUT',
		headers: { 'Authorization': `Token ${accessToken}` },
		data: params,
		url: `${apiConst.gameApi}`
	};
	
	return axios(options);
};

export function getAIturn(accessToken) {
	debugger;

	const options = {
		method: 'GET',
		headers: { 'Authorization': `Token ${accessToken}` },
		url: `${apiConst.gameTurnApi}`
	};
	
	return axios(options);
};

export function setUserTurn(accessToken, userTurn) {
	debugger;

	const params = {
		userTurn: userTurn,
	};

	const options = {
		method: 'POST',
		headers: { 'Authorization': `Token ${accessToken}` },
		data: params,
		url: `${apiConst.gameTurnApi}`
	};
	
	return axios(options);
};


  
  