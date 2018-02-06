import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import AppBar from 'material-ui/AppBar';

import {Redirect} from 'react-router-dom';

import AuthService from '../../containers/Login/AuthService';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password:'',
            userRequired: undefined,
            passRequired: undefined,
            redirect:false
        }

        this.handleClick = this.handleClick.bind(this);

        this.AuthService = new AuthService();
    }

    handleClick(event) {
        event.preventDefault();

        if(this.state.username.trim()) {
            if(this.state.password.trim()) {
                this.AuthService.login(this.state.username, this.state.password);

                if(this.AuthService.isLoggedIn()) {
                    this.setState({
                        redirect: true
                    })
                }
            } else {
                this.setState({
                    userRequired: undefined,
                    passRequired: "Password is required."
                })
            }
        } else {
            this.setState({
                username: this.state.username.trim(),
                userRequired: "Username is required.",
                passRequired: undefined
            })
        }
    }

    componentDidMount() {
        if(this.AuthService.isLoggedIn()) {
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
                        <div>
                            <AppBar showMenuIconButton={false} title="Login"/>
                            <TextField
                                hintText="Enter your Username"
                                errorText={this.state.userRequired}
                                floatingLabelText="Username"
                                onChange={(event, newValue) => this.setState({username: newValue})}
                                required={true}
                            />
                            <br/>
                            <TextField
                                type="password"
                                hintText="Enter your Password"
                                errorText={this.state.passRequired}
                                floatingLabelText="Password"
                                onChange={(event, newValue) => this.setState({password: newValue})}
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
