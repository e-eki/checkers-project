
import React, { Component } from 'react';

import AuthUtilsForm from '../../forms/authUtilsForm';

export class LoginPage extends Component {

	render() {

		return (
			<AuthUtilsForm name = 'LoginPage'/>
		)
	}
};

export class RegistrationPage extends Component {

	render() {

		return (
			<AuthUtilsForm name = 'RegistrationPage'/>
		)
	}
};

export class RecoveryPasswordPage extends Component {

	render() {

		return (
			<AuthUtilsForm name = 'RecoveryPasswordPage'/>
		)
	}
};

export class EmailConfirmPage extends Component {

	render() {

		return (
			<AuthUtilsForm name = 'EmailConfirmPage'/>
		)
	}
};

export class ResetPasswordPage extends Component {

	render() {

		return (
			<AuthUtilsForm name = 'ResetPasswordPage'/>
		)
	}
};

