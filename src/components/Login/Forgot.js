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
import Login from "./Login";
import PropTypes from "prop-types";

class Forgot extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: ''
        };

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {

        if(this.state.email.trim() !== '') {
            var body = {};
            var _this = this;

            body.emailAddress = this.state.email.trim();;

            _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + '/sweng500/resetPassword', 'POST', constants.useCredentials(), body).then(function (result) {
                _this.setState({email : "", emailRequired: null}, () => {
                    _this.props.notify(
                        "Success: Password reset email sent",
                        "success",
                        "tc",
                        5
                    );
                    $('#reset-container').addClass('collapse');
                });
            }).catch(function (error) {
                _this.setState({
                    email: _this.state.email.trim(),
                    emailRequired: "Provide valid email address."
                }, () => {
                    _this.props.notify(
                        "Error: Could not send password reset email.  Provide a valid email address.",
                        "error",
                        "tc",
                        5
                    );
                });
            })

        } else {
            this.setState({
                email: this.state.email.trim(),
                emailRequired: "An email address is required."
            })
        }
    }

    render() {
        return (
            <div id='login-div'>
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
    }
}

export default Forgot;
