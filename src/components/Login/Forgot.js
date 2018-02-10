import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import AppBar from 'material-ui/AppBar';

import {Redirect} from 'react-router-dom';

import AuthService from '../../containers/Login/AuthService';

class Forgot extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
        }

        this.handleClick = this.handleClick.bind(this);

        this.AuthService = new AuthService();
    }

    handleClick(event) {
        event.preventDefault();

        if(this.state.email.trim()) {

            // received an email address


        } else {
            this.setState({
                email: this.state.email.trim(),
                emailRequired: "Email address is required."
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
                            <AppBar showMenuIconButton={false} title="Password Recovery"/>
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