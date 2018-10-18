
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// страница 'не найдено'
export default class NotFoundPage extends Component {

	constructor(props) {
		super(props);
	}

	render() {

		console.log('--------render notFoundPage--------------');

		return (

			<div className = 'page'>
			
				<div>
					Страница не найдена. Вернуться на <Link to='/'>главную</Link>.
				</div>
			</div>
		)
	}
}