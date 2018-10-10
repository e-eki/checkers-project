
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// страница входа на сайт
export default class LoginPage extends Component {

	constructor(props) {
		super(props);
	}

	componentWillUnmount() {

		console.log('login unm!!');
	}

	render() {

		console.log('--------render loginPage--------------');

		return (

			<div className = 'page'>
			
				<div className = 'content'>

					<div>Вход</div>

					

				</div>
			</div>
		)
	}
}