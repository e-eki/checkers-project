import axios from 'axios';
const Promise = require('bluebird');

import apiConst from '../apiConst';

export function getResponseMessage(response) {
	debugger;

	let message;

	switch (response.status) {

		case 200:
		case 201:
		case 204:
			break;

		case 400: 
			message = 'Запрос не может быть обработан: ';
			break;

		case 401: 
			message = 'Ошибка авторизации: ';
			break;

		case 403: 
			message = 'Ошибка доступа: ';
			break;	

		case 404: 
			message = 'Ресурс не найден: ';
			break;	

		case 500: 
			message = 'Internal server error: ';
			break;	

		default:
			message = 'Internal server error: ';  //???
			break;	
	};

	message = (message || '') + (response.message || response.data || '');

	return message;
}