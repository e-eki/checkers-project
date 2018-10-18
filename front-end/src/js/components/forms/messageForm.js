
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// форма вывода сообщений для юзера
export default class MessageForm extends Component {

	constructor(props) {
		super(props);

	}

	shouldComponentUpdate(nextProps, nextState) {
		
		return (nextProps.className !== this.props.className || nextProps.message !== '');
	}
	

	render() {
		console.log('--------render messageForm--------------');
		const messageFormClass = 'message-form ' + (this.props.className ? this.props.className : '');

		return (
			<div className = {messageFormClass}>

				<p>{this.props.message}</p>

				<Link to = {this.props.messageLink}>
					{this.props.messageLinkName}	
				</Link>

			</div>
		)
	}
}