import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import AppBar from 'material-ui/AppBar';
import PasswordField from 'material-ui-password-field'

import {Redirect} from 'react-router-dom';

import AuthService from '../../containers/Login/AuthService';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            emailAddress: '',
            password:'',
            emailRequired: undefined,
            passRequired: undefined,
            redirect:false
        }

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
        event.preventDefault();

        if(this.state.emailAddress.trim()) {
            if(this.state.password.trim()) {

                AuthService.login(this.state.emailAddress, this.state.password).then(function (result) {

                }).catch(function (error) {
                    console.log(error);
                }).then(() => {
                        if (AuthService.isLoggedIn()) {
                            this.setState({
                                redirect: true
                            })
                        } else {
                            this.props.notify(
                                "ERROR: Please provide valid login credentials.",
                                "error",
                                "tc",
                                6
                            )
                        }
                    }
                );
            } else {
                this.setState({
                    emailRequired: undefined,
                    passRequired: "Password is required."
                })
            }
        } else {
            this.setState({
                emailAddress: this.state.emailAddress.trim(),
                emailRequired: "An email address is required.",
                passRequired: undefined
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
                    <MuiThemeProvider>
                        <div style={{width:275}}>
                            <AppBar showMenuIconButton={false} title="Login"/>
                            <TextField
                                hintText="Enter your email address"
                                errorText={this.state.emailRequired}
                                floatingLabelText="Email Address"
                                onChange={(event, newValue) => this.setState({emailAddress: newValue})}
                                required={true}
                                fullWidth={true}
                            />
                            <br/>
                            <PasswordField
                                type="password"
                                errorText={this.state.passRequired}
                                floatingLabelText="Password"
                                onChange={(event, newValue) => this.setState({password: newValue})}
                                fullWidth={true}
                                required={true}
                            />
                            <br/>
                            <RaisedButton label="Submit" primary={true} style={{margin:15}}
                                          onClick={(event) => this.handleClick(event)}/>
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

Login.propTypes = {
    notify: PropTypes.any,
}
Login.defaultProps = {
    notify : null
}

export default Login;
