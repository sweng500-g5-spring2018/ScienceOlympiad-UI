import React, { Component } from 'react';
import {BrowserRouter, Route} from 'react-router-dom';

import App from './components/app/App';
import Contact from './components/contact/contact';
import NotFound from './components/not_found/notFound';

// const Routes = (props) => (
//     <Router {...props}>
//         <Route path="/" component={App}>
//             <Route path="/contact" component={Contact} />
//             <Route path="*" component={NotFound} />
//         </Route>
//     </Router>
// );

class Routes extends Component {
    render() {
        return (
            <BrowserRouter>
                <div id="route-container">
                    <Route path = '/' component = {App} />
                    <Route path = '/contact' component = {Contact} />
                    <Route path = '/notFound' component = {NotFound} />
                </div>
            </BrowserRouter>
        )
    }
}

export default Routes;