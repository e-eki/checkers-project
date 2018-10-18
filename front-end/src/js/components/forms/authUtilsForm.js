
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
const Promise = require('bluebird');

import MessageForm from './messageForm';
import * as authActions from '../actions/authActions';
import * as utilsActions from '../actions/utilsActions';

// страница входа на сайт
export default class AuthUtilsForm extends Component {

	constructor(props) {
		super(props);

		this.titles = {
			vkTitle: 'Войти с помощью Вконтакте',
			fbTitle: 'Войти с помощью Facebook',
			googleTitle: 'Войти с помощью Google',
		};

		/*this.apiUrl = {
			//loginApi: `${apiConst.api_url}/login/`,
			//vkApi: `https://oauth.vk.com/authorize?client_id=${apiConst.vk_client_id}&display=page&scope=email&redirect_uri=${apiConst.api_url}/login&response_type=code&v=5.85&state=vk`,
			//googleApi: `https://accounts.google.com/o/oauth2/auth?redirect_uri=${apiConst.api_url}/login&response_type=code&client_id=${apiConst.google_client_id}&scope=https://www.googleapis.com/auth/userinfo.email`,
			changePasswordApi: `${apiConst.changePasswordApi}/changepassword/`,
			emailConfirmApi: `${apiConst.emailConfirmApi}/emailconfirm/`,
		}*/

		this.defaultData = {
			emailData: 'Введите e-mail',
			loginData: 'Введите логин',
			passwordData: 'Введите пароль',
			duplicatePasswordData: 'Повторите пароль',

			messageLink: '/login',
			messageLinkName: 'На страницу входа',
		};

		this.warningData = {
			emailData: 'Введите корректный e-mail',
			loginData: 'Введите корректный логин',
			passwordData: 'Введите корректный пароль',
			duplicatePasswordData: 'Пароли не совпадают'
		};

		this.state = {
			emailData: this.defaultData.emailData,
			loginData: this.defaultData.loginData,
			passwordData: this.defaultData.passwordData,
			duplicatePasswordData: this.defaultData.duplicatePasswordData,
			messageIsShown: false,
			message: '',
			messageLink: this.defaultData.messageLink,
			messageLinkName: this.defaultData.messageLinkName,
		};

		this.changeData = this.changeData.bind(this);
		this.clickLoginButton = this.clickLoginButton.bind(this);
		this.clearData = this.clearData.bind(this);
		this.clickSocialLoginButton = this.clickSocialLoginButton.bind(this);
		this.resetPage = this.resetPage.bind(this);
		this.responseHandle = this.responseHandle.bind(this);
		this.clickRecoveryPasswordButton = this.clickRecoveryPasswordButton.bind(this);
		this.checkData = this.checkData.bind(this);
		this.clickEmailConfirmButton = this.clickEmailConfirmButton.bind(this);
		this.clickResetPasswordButton = this.clickResetPasswordButton.bind(this);
		this.clickRegistrationButton = this.clickRegistrationButton.bind(this);
		this.getFormContent = this.getFormContent.bind(this);
	}

	// по клику на инпуте он очищается
	clearData(event) {

		const dataName = event.target.name;

		this.state[`${dataName}Data`] = '';
		this.setState({});
	}

	// ввод данных юзером
	changeData(event) {

		const dataName = event.target.name;

		this.state[`${dataName}Data`] = event.target.value;
		this.setState({});
	}

	//check user data
	//TODO: переписать 
	checkData(emailData, loginData, passwordData, duplicatePasswordData) {
		
		if ( emailData !== undefined && (
			emailData == this.defaultData.emailData || emailData == this.warningData.emailData 
			|| emailData == '')) {
			this.setState({
				emailData: this.warningData.emailData
			});

			return false;
		}
		else if ( loginData !== undefined && (
			loginData == this.defaultData.loginData || loginData == this.warningData.loginData 
			|| loginData == '')) {
			this.setState({
				loginData: this.warningData.loginData
			});

			return false;
		}
		else if ( passwordData !== undefined && (
				passwordData == this.defaultData.passwordData || 
				passwordData == this.warningData.passwordData|| passwordData == '')) {
					this.setState({
						passwordData: this.warningData.passwordData
					});

					return false;
		}
		else if ( duplicatePasswordData !== undefined && (
			duplicatePasswordData == this.defaultData.duplicatePasswordData || 
			duplicatePasswordData == this.warningData.duplicatePasswordData || 
			duplicatePasswordData !== passwordData || duplicatePasswordData == '')) {
				this.setState({
					duplicatePasswordData: this.warningData.duplicatePasswordData
				});

				return false;
		}

		return true;
	}

	clickLoginButton(event) {
		debugger;

		let dataIsCorrect = this.checkData(this.state.emailData, undefined, this.state.passwordData);

		if (!dataIsCorrect) return;

		return authActions.loginAction(this.state.emailData, this.state.passwordData)
			.then((response) => {
				//response.data
				//response.status
				//response.statusText

				this.state.messageLink = '/';
				this.state.messageLinkName = 'На главную';
				
				response.data = 'Вы успешно вошли на сайт. Нажмите ссылку для перехода.';
				this.responseHandle(response);
			})
			.catch((error) => {
				//error.response.data
				//error.response.status
				//error.response.statusText

				this.responseHandle(error);
			})
	}

	clickRegistrationButton(event) {
		debugger;

		let dataIsCorrect = this.checkData(this.state.emailData, this.state.loginData, this.state.passwordData, this.state.duplicatePasswordData);

		if (!dataIsCorrect) return;

		return authActions.registrationAction(this.state.emailData, this.state.loginData, this.state.passwordData)
			.then((response) => {

				//this.state.messageLink = this.defaultData.messageLink;
				//this.state.messageLinkName = this.defaultData.messageLinkName;
				
				response.data = 'Вы успешно зарегистрировались на сайте. Нажмите ссылку для перехода.';
				this.responseHandle(response);
			})
			.catch((error) => {

				this.responseHandle(error);
			})
	}

	clickSocialLoginButton(event) {

		const service = event.target.name;

		// TODO!!! vkontakte api не отвечает localhost (нет 'Access-Control-Allow-Origin' в заголовке)
		return authActions.socialLoginAction(service)
			.then((response) => {

				this.state.messageLink = '/';
				this.state.messageLinkName = 'На главную';

				response.data = 'Вы успешно вошли на сайт. Нажмите ссылку для перехода.';
				this.responseHandle(response);
			})
			.catch((error) => {

				this.responseHandle(error);
			})
	}

	clickRecoveryPasswordButton(event) {
		debugger;

		let dataIsCorrect = this.checkData(this.state.emailData);

		if (!dataIsCorrect) return;
		
		return authActions.recoveryPasswordAction(this.state.emailData)
			.then((response) => {
				
				//this.state.messageLink = this.defaultData.messageLink;
				//this.state.messageLinkName = this.defaultData.messageLinkName;
				
				response.data = 'Инструкции по восстановлению пароля отправлены на указанный адрес электронной почты.';
				this.responseHandle(response);
			})
			.catch((error) => {

				this.responseHandle(error);
			})
	}

	clickEmailConfirmButton(event) {
		debugger;

		let dataIsCorrect = this.checkData(this.state.emailData);

		if (!dataIsCorrect) return;
		
		return authActions.emailConfirmAction(this.state.emailData)
			.then((response) => {

				//this.state.messageLink = this.defaultData.messageLink;
				//this.state.messageLinkName = this.defaultData.messageLinkName;

				if (response.data == 'Confirm mail sent again') {

					response.data = 'Письмо с кодом подтверждения отправлено на указанный адрес электронной почты.';
				}
						
				this.responseHandle(response);
			})
			.catch((error) => {

				this.responseHandle(error);
			})
	}

	// TODO!!!: должен извлекать параметр из строки запроса, и использовать его как аксесс токен при запросе на сброс пароля
	clickResetPasswordButton(event) {
		debugger;

		let dataIsCorrect = this.checkData(undefined, undefined, this.state.passwordData, this.state.duplicatePasswordData);

		if (!dataIsCorrect) return;

		return Promise.resolve(true)
			.then(() => {

				// если на форму попали по ссылке из письма
				if (this.props.match && this.props.match.params && this.props.match.params.id) {
					
					return this.props.match.params.id;
				}
				// если из личного кабинета
				else {

					return authActions.getActualAccessToken();
				}
			})
			.then((accessToken) => {

				return authActions.changePasswordAction(accessToken, this.state.passwordData)
			})
			.then((response) => {

				//this.state.messageLink = this.defaultData.messageLink;
				//this.state.messageLinkName = this.defaultData.messageLinkName;

				response.data = 'Пароль успешно изменен.';			
				this.responseHandle(response);
			})
			.catch((error) => {

				this.responseHandle(error);
			})
	}

	responseHandle(response) {
		debugger;

		if (response.response) response = response.response;  // если это ошибка

		let message = utilsActions.getResponseMessage(response);

		this.setState({
			messageIsShown: true,
			message: message,
		});
	}

	resetPage() {
		debugger;

		this.page.removeEventListener('click', this.resetPage);
		this.page.removeEventListener('keydown', this.resetPage);
		
		this.setState({
			messageIsShown: false,
			message: '',
			messageLink: this.defaultData.messageLink,
			messageLinkName: this.defaultData.messageLinkName,

			emailData: this.defaultData.emailData,
			loginData: this.defaultData.loginData,
			passwordData: this.defaultData.passwordData,
			newPasswordData: this.defaultData.newPasswordData,   
			duplicatePasswordData: this.defaultData.duplicatePasswordData,
		})
	}

	componentDidUpdate(prevState) {  
		debugger;   
        // если стала видна форма с сообщением юзеру
		if (!prevState.messageIsShown && this.state.messageIsShown) {

            this.page.addEventListener('click', this.resetPage);
            this.page.addEventListener('keydown', this.resetPage);
		}
	}

	getFormContent() {

		const LoginFormContent = (

			<div className = 'content__auth-utils-form auth-utils-form'>

				<div className = 'auth-utils-form_title'>Вход</div>

				<div className = 'auth-utils-form_social'>

					<img 
						name = "vkontakte"
						className = 'social-icon' 
						src = '/icons/vkontakte-icon_blue.png' 
						alt = {this.titles.vkTitle} 
						title = {this.titles.vkTitle}
						onClick = {this.clickSocialLoginButton}>
					</img>

					<img 
						name = "facebook"
						className = 'social-icon social-icon_facebook' 
						src = '/icons/facebook-icon_grey.png' 
						alt = {this.titles.fbTitle} 
						title = {this.titles.fbTitle}>
					</img>

					<img 
						name = "google"
						className = 'social-icon' 
						src = '/icons/google-icon_red.png' 
						alt = {this.titles.googleTitle} 
						title = {this.titles.googleTitle}
						onClick = {this.clickSocialLoginButton}>
					</img>
				</div>

				<input 
					name = "email"
					type="text" 
					className = 'auth-utils-form_input' 
					maxLength = '40'
					value = {this.state.emailData}
					onChange = {this.changeData}
					onClick = {this.clearData}
				/>
				<input 
					name = 'password'
					type = "text" 
					className = 'auth-utils-form_input' 
					maxLength = '40'
					value = {this.state.passwordData}
					onChange = {this.changeData}
					onClick = {this.clearData}
				/>

				<button className = 'button button_login auth-utils-form__button' onClick = {this.clickLoginButton}>Войти</button>

				<div className = 'auth-utils-form_text'>или</div>

				<Link to="/registration">
					<button className = 'button button_reg auth-utils-form__button'>Зарегистрироваться</button>
				</Link>

				<Link className = 'auth-utils-form_link' to="/recoveryPassword">
					Забыли пароль?	
				</Link>

				<Link className = 'auth-utils-form_link' to="/emailConfirm">
					Не пришло письмо?	
				</Link>

				<Link className = 'auth-utils-form_link' to="/">
					На главную	
				</Link>

			</div>
		);

		const RegistrationFormContent = (

			<div className = 'content__auth-utils-form auth-utils-form'>

				<div className = 'auth-utils-form_title'>Регистрация</div>

				<input 
					name = "email"
					type="text" 
					className = 'auth-utils-form_input' 
					maxLength = '40'
					value = {this.state.emailData}
					onChange = {this.changeData}
					onClick = {this.clearData}
				/>

				<input 
					name = "login"
					type="text" 
					className = 'auth-utils-form_input' 
					maxLength = '40'
					value = {this.state.loginData}
					onChange = {this.changeData}
					onClick = {this.clearData}
				/>

				<input 
					name = 'password'
					type = "text" 
					className = 'auth-utils-form_input' 
					maxLength = '40'
					value = {this.state.passwordData}
					onChange = {this.changeData}
					onClick = {this.clearData}
				/>

				<input 
					name = "duplicatePassword"
					type = "text" 
					className = 'auth-utils-form_input' 
					maxLength = '40'
					value = {this.state.duplicatePasswordData}
					onChange = {this.changeData}
					onClick = {this.clearData}
				/>

				<button className = 'button button_reg auth-utils-form__button' onClick = {this.clickRegistrationButton}>Зарегистрироваться</button>

				<Link className = 'auth-utils-form_link' to="/recoveryPassword">
					Забыли пароль?	
				</Link>

				<Link className = 'auth-utils-form_link' to="/emailConfirm">
					Не пришло письмо?	
				</Link>

				<Link className = 'auth-utils-form_link' to="/">
					На главную	
				</Link>

			</div>
		);
		
		const recoveryPasswordContent = (

			<div className = 'content__auth-utils-form auth-utils-form'>				
				<div className = 'auth-utils-form_title'>Восстановление пароля</div>

				
				<input 
					name = "email"
					type = "text" 
					className = 'auth-utils-form_input' 
					maxLength = '40'
					value = {this.state.emailData}
					onChange = {this.changeData}
					onClick = {this.clearData}
				/>

				<button className = 'button button_send auth-utils-form__button' onClick = {this.clickRecoveryPasswordButton}>Отправить</button>
				
				<Link className = 'auth-utils-form_link' to="/login">
					На страницу входа	
				</Link>

			</div>
		);

		const emailConfirmContent = (

			<div className = 'content__auth-utils-form auth-utils-form'>				
				<div className = 'auth-utils-form_title'>Повторная отправка письма</div>

				
				<input 
					name = "email"
					type = "text" 
					className = 'auth-utils-form_input' 
					maxLength = '40'
					value = {this.state.emailData}
					onChange = {this.changeData}
					onClick = {this.clearData}
				/>

				<button className = 'button button_send auth-utils-form__button' onClick = {this.clickEmailConfirmButton}>Отправить</button>
				
				<Link className = 'auth-utils-form_link' to="/login">
					На страницу входа	
				</Link>

			</div>
		);

		const resetPasswordContent = (

			<div className = 'content__auth-utils-form auth-utils-form'>				
				<div className = 'auth-utils-form_title'>Восстановление пароля</div>

				
				<input 
					name = "password"
					type = "text" 
					className = 'auth-utils-form_input' 
					maxLength = '40'
					value = {this.state.passwordData}
					onChange = {this.changeData}
					onClick = {this.clearData}
				/>

				<input 
					name = "duplicatePassword"
					type = "text" 
					className = 'auth-utils-form_input' 
					maxLength = '40'
					value = {this.state.duplicatePasswordData}
					onChange = {this.changeData}
					onClick = {this.clearData}
				/>

				<button className = 'button button_send auth-utils-form__button' onClick = {this.clickResetPasswordButton}>Отправить</button>
				
				<Link className = 'auth-utils-form_link' to="/login">
					На страницу входа	
				</Link>

			</div>
		);

		let formContent;

		switch (this.props.name) {

			case 'LoginPage':
				formContent = LoginFormContent;
				break;

			case 'RegistrationPage':
				formContent = RegistrationFormContent;
				break;

			case 'RecoveryPasswordPage':
				formContent = recoveryPasswordContent;
				break;

			case 'EmailConfirmPage':
				formContent = emailConfirmContent;
				break;

			case 'ResetPasswordPage':
				formContent = resetPasswordContent;
				break;				

			default:  //??
				this.responseHandle('form error: no form name');
				break;
		};

		return formContent;
	}

	render() {

		console.log('--------render authUtilsPage--------------');

		const contentClass = 'page__content content' + (this.state.messageIsShown ? ' content_transparent' : '');
		const messageFormClass = 'page__message-form ' + (this.state.messageIsShown ? 'message-form_shown' : 'message-form_hidden');

		const formContent = this.getFormContent();

		return (

			<div ref = {elem => this.page = elem} className = 'page'>
			
				<div className = {contentClass}>
					{formContent}
				</div>

				<MessageForm
					className = {messageFormClass}
					message = {this.state.message}
					messageLink = {this.state.messageLink}
					messageLinkName = {this.state.messageLinkName}
				/>

			</div>
		)
	}
}