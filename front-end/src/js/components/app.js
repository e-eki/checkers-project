
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import GamePage from './game/gamePage';
import LoginPage from './login/loginPage';
import RegistrationPage from './registration/registrationPage';
import NotFoundPage from './notFound/notFoundPage';

export default class App extends Component {

    render() {

        return (

            <Switch>

                <Route exact path="/" component={GamePage} />
                <Route path="/login" component={LoginPage} />
                <Route path="/registration" component={RegistrationPage} />

                <Route component={NotFoundPage} />
                
            </Switch>
        )
    }
}