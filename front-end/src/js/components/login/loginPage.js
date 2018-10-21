
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import apiConst from '../apiConst';

// страница входа на сайт
export default class LoginPage extends Component {

	constructor(props) {
		super(props);

		this.defaultData = {
			emailData: 'Введите e-mail',
			passwordData: 'Введите пароль',
		};

		this.state = {
			emailData: this.defaultData.emailData,
			passwordData: this.defaultData.passwordData,
		};

		this.changeData = this.changeData.bind(this);
		this.clickLoginButton = this.clickLoginButton.bind(this);
		this.clearData = this.clearData.bind(this);
		this.socialLogin = this.socialLogin.bind(this);

	}

	// по клику на инпуте он очищается
	clearData(event) {

		if (event.target.name == 'email') {
			this.setState({
				emailData: ''
			});
		}
		else if (event.target.name == 'password') {
			this.setState({
				passwordData: ''
			});
		}
	}

	// ввод данных юзером
	changeData(event) {

		console.log(event.target.name, event.target.value);

		if (event.target.name == 'email') {
			this.setState({
				emailData: event.target.value
			});
		}
		else if (event.target.name == 'password') {
			this.setState({
				passwordData: event.target.value
			});
		}
	}

	clickLoginButton(event) {

		//check user data
		if (this.state.emailData == this.defaultData.emailData || this.state.emailData == '') {
			this.setState({
				emailData: 'Введите корректный e-mail'
			});

			return;
		}
		else if (this.state.passwordData == this.defaultData.passwordData || this.state.passwordData == '') {
			this.setState({
				passwordData: 'Введите корректный пароль'
			});

			return;
		}

		return axios.post(`${apiConst.api_url}/login/`, {
			email: this.state.emailData,
			password: this.state.passwordData
		})
			.then((response) => {
				debugger;
				console.log(response);
				
			})
			.catch((error) => {

				const answer = alert(error.message);
			})

	}

	socialLogin(event) {

		const service = event.target.name;
		let socialLink;

		switch (service) {
			case 'vkontakte':
				socialLink = `https://oauth.vk.com/authorize?client_id=${apiConst.vk_client_id}&display=page&scope=email&redirect_uri=${apiConst.api_url}/login&response_type=code&v=5.85&state=vk`;
				break;
			case 'google':
				socialLink = `https://accounts.google.com/o/oauth2/auth?redirect_uri=${apiConst.api_url}/login&response_type=code&client_id=${apiConst.google_client_id}&scope=https://www.googleapis.com/auth/userinfo.email`;
				break;
			default:  //??
				console.log('login error: no service name');
				break;
		}
		debugger;

		// TODO!!! vkontakte api не отвечает localhost (нет 'Access-Control-Allow-Origin' в заголовке)
		return axios.get(socialLink)
			.then((response) => {
				debugger;
				console.log(response);
				//redirect
			})
			.catch((error) => {

				const answer = alert(error.message);
			})
	}

	render() {

		console.log('--------render loginPage--------------');

		const vkTitle = 'Войти с помощью Вконтакте';
		const fbTitle = 'Войти с помощью Facebook';
		const googleTitle = 'Войти с помощью Google';

		return (

			<div className = 'page'>
			
				<div className = 'content'>
				
					<div className = 'content__login-form login-form'>				
						<div className = 'login-form_title'>Вход</div>

						<div className = 'login-form_social'>

							<img 
								name = "vkontakte"
								className = 'social-icon' 
								src = '/icons/vkontakte-icon_blue.png' 
								alt = {vkTitle} 
								title = {vkTitle}
								onClick = {this.socialLogin}>
							</img>

							<img 
								name = "facebook"
								className = 'social-icon social-icon_facebook' 
								src = '/icons/facebook-icon_grey.png' 
								alt = {fbTitle} 
								title = {fbTitle}>
							</img>

							<img 
								name = "google"
								className = 'social-icon' 
								src = '/icons/google-icon_red.png' 
								alt = {googleTitle} 
								title = {googleTitle}
								onClick = {this.socialLogin}>
							</img>
						</div>

						<input 
							name = "email"
							type="text" 
							className = 'login-form_input' 
							maxLength = '40'
							value = {this.state.emailData}
							onChange = {this.changeData}
							onClick = {this.clearData}
						/>
						<input 
							name = 'password'
							type = "text" 
							className = 'login-form_input' 
							maxLength = '40'
							value = {this.state.passwordData}
							onChange = {this.changeData}
							onClick = {this.clearData}
						/>

						<button className = 'button button_login login-form__button' onClick = {this.clickLoginButton}>Войти</button>
						
						<div className = 'login-form_text'>или</div>
						
						<Link to="/registration">
							<button className = 'button button_reg login-form__button' onClick = {this.clickLoginButton}>Зарегистрироваться</button>
						</Link>

					</div>

				</div>
			</div>
		)
	}
}