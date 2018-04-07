import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import AppBar from 'material-ui/AppBar';
import NotificationSystem from 'react-notification-system';

import {Redirect} from 'react-router-dom';

import AuthService from '../../utils/AuthService';
import HttpRequest from "../../adapters/httpRequest";
import constants from "../../utils/constants";
import {style} from "../../variables/Variables";
import $ from "jquery";

class Forgot extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            _notificationSystem : null
        }

        this.handleClick = this.handleClick.bind(this);

        this.AuthService = new AuthService();
    }

    notify(message, level, position, autoDismiss) {
        this.state._notificationSystem.addNotification({
            title: (<span data-notify="icon" className="pe-7s-door-lock"></span>),
            message: (
                <div>
                    {message}
                </div>
            ),
            level: level ? level : 'error',
            position: position ? position : 'tc',
            autoDismiss: autoDismiss ? autoDismiss : 10,
        });
    }

    handleClick(event) {

        if(this.state.email.trim()) {

            this.setState({
                email: this.state.email.trim(),
                emailRequired: null
            })

            var body = {};
            var _this = this;

            body.emailAddress = this.state.email;

            _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + '/sweng500/resetPassword', 'POST', constants.useCredentials(), body).then(function (result) {
                _this.setState({email : ""});
                _this.props.notify(
                    "Success: Password reset email sent",
                    "success",
                    "tc",
                    10
                );
                $('#reset-container').addClass('collapse');
            }).catch(function (error) {
                _this.props.notify(
                    "Error: Could not send password reset email",
                    "error",
                    "tc",
                    10
                );
            })

        } else {
            this.setState({
                email: this.state.email.trim(),
                emailRequired: "An email address is required."
            })
        }
    }

    componentDidMount() {
        if(AuthService.isLoggedIn()) {
            this.setState({
                redirect: true
            })
        }
    }

    render() {
        if(!this.state.redirect) {
            return (
                <div id='login-div'>
                    <NotificationSystem ref="notificationSystem" style={style}/>
                    <MuiThemeProvider>
                       <div>
                            <AppBar showMenuIconButton={false} title="Password Recovery"/>
                           <div id='reset-container'>
                                <TextField
                                    hintText="Enter your email address"
                                    errorText={this.state.emailRequired}
                                    floatingLabelText="Email Address"
                                    onChange={(event, newValue) => this.setState({email: newValue})}
                                    required={true}
                                />
                                <br/>
                                <RaisedButton label="Submit" primary={true} style={{margin:15}}
                                              onClick={(event) => this.handleClick(event)}/>
                           </div>
                        </div>
                    </MuiThemeProvider>
                </div>
            )
        } else {
            return (
                <Redirect from="/" to="/app/dashboard" />
            )
        }
    }
}

export default Forgot;
