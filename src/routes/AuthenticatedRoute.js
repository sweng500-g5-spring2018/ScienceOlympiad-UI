import React from 'react';
import {
    Route,
    Redirect
} from 'react-router-dom';

import AuthService from "../utils/AuthService";

/**
 * We have to make our own Authenticated Route.... So here it is -_-
 * @param Component
 * @param rest
 * @returns {*}
 * @constructor
 */
const AuthenticatedRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        AuthService.isLoggedIn() && AuthService.isUserRoleAllowed(rest.users)? (
            <Component {...props}/>
        ) : (
            <Redirect to={{
                pathname: '/login',
                state: { from: props.location }
            }}/>
        )
    )}/>
)

export default AuthenticatedRoute;