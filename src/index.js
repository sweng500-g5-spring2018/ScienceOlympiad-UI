import React from 'react';
import ReactDOM from 'react-dom';

import EasterEgg from './views/EasterEgg/sudoku';

import {
    HashRouter,
    Route,
    Switch,
    Redirect
} from 'react-router-dom';

import App from './containers/App/App';
import LoginContainer from "./containers/Login/LoginContainer";


import './assets/css/bootstrap.min.css';
import './assets/css/animate.min.css';
import './assets/css/light-bootstrap-dashboard.css';
import './assets/css/demo.css';
import './assets/css/pe-icon-7-stroke.css';

ReactDOM.render((
    <HashRouter>
        <Switch>
            <Route path="/app" name="Home" component={App}/>
            <Route path="/login" name="Login" component={LoginContainer} />
            <Route path="/easteregg/sudoku" name="Sudoku" component={EasterEgg} />
            <Redirect from="/" to="/login" />
        </Switch>
    </HashRouter>
),document.getElementById('root'));
