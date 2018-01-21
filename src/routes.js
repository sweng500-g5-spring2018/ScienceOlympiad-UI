import React, { Component } from 'react';
import {BrowserRouter, Route} from 'react-router-dom';

import App from './components/app/App';
import Contact from './components/contact/contact';
import TestModule from './components/not_found/testModule';

class Routes extends Component {
    render() {
        return (
            <BrowserRouter>
                <div id="route-container">
                    <Route path = '/' component = {App} />
                    <Route path = '/contact' component = {Contact} />
                    <Route path = '/testModule' component = {TestModule} />
                </div>
            </BrowserRouter>
        )
    }
}

export default Routes;