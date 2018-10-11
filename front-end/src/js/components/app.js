
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import GamePage from './game/gamePage';
import LoginPage from './login/loginPage';
import RegistrationPage from './registration/registrationPage';
import NotFoundPage from './notFound/notFoundPage';

export default class App extends Component {

    render() {

        //??? должен ли сервер отдавать эти страницы по этим роутам?
        // страница может быть в билде, который сервер отдает по адресу, или на сервере по отдельному адресу
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