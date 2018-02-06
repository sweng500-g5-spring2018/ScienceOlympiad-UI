import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import AppBar from 'material-ui/AppBar';
import {Redirect} from 'react-router-dom';

import AuthService from '../../containers/Login/AuthService';

class Signup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password:'',
            password2:'',
            userRequired:'',
            passRequired:'',
            pass2Required:'',
            redirect:false
        }

        this.handleClick = this.handleClick.bind(this);

        this.AuthService = new AuthService();
    }

    areFieldsValid() {
        if(!this.state.username) {
            this.setState({userRequired: "This is a required field.", passRequired:undefined, pass2Required:undefined});
            return false;
        }
        if(!this.state.password) {
            this.setState({userRequired:undefined, passRequired: "This is a required field.", pass2Required:undefined});
            return false;
        }
        if(!this.state.password2) {
            this.setState({userRequired:undefined, passRequired: undefined, pass2Required: "This is a required field."});
            return false;
        }
        if(this.state.password2 !== this.state.password) {
            this.setState({userRequired:undefined, passRequired: "The passwords must match.",pass2Required: "The passwords must match."});
            return false;
        }
        return true;
    }

    handleClick(event) {
        event.preventDefault();
        console.log(this.state);

        if(this.areFieldsValid()) {
            this.AuthService.login(this.state.username, this.state.password);

            if(this.AuthService.isLoggedIn()) {
                this.setState({
                    redirect: true
                })
            }
        } else {
            this.props.notify(
                "Error attempting to Signup.  Ensure fields are correctly filled out.",
                "error",
                "tr",
                15
            )
        }

        // this.props.loginUser({user: this.state.username, pass: this.state.password});
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
                            <AppBar showMenuIconButton={false} title="Coach Signup"/>
                            <TextField
                                hintText="Enter your Username"
                                errorText={this.state.userRequired}
                                floatingLabelText="Username"
                                onChange={(event, newValue) => this.setState({username: newValue})}
                            />
                            <br/>
                            <TextField
                                type="password"
                                hintText="Enter your Password"
                                errorText={this.state.passRequired}
                                floatingLabelText="Password"
                                onChange={(event, newValue) => this.setState({password: newValue})}
                            />
                            <br/>
                            <TextField
                                type="password"
                                hintText="Re-enter your Password"
                                errorText={this.state.pass2Required}
                                floatingLabelText="Password"
                                onChange={(event, newValue) => this.setState({password2: newValue})}
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

Signup.propTypes = {
    notify: PropTypes.any,
}
Signup.defaultProps = {
    notify : null
}

export default Signup;
