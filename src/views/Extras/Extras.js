import React, { Component } from 'react';
import {
    Grid, Row, Col,
} from 'react-bootstrap';

import {UserCard} from '../../components/Cards/UserCard.js';
import InputMask from 'react-input-mask';
import Button from '../../elements/CustomButton/CustomButton.js';

import {TextField} from "material-ui";
import HttpRequest from "../../adapters/httpRequest";
import constants from "../../utils/constants";
import AuthService from "../../utils/AuthService";
import NotificationSystem from 'react-notification-system';
import {style} from "../../variables/Variables";
import AppBar from 'material-ui/AppBar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import PasswordField from 'material-ui-password-field';

class Extras extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            user : {},
            _notificationSystem : null,
            emailAddress : "",
            phoneNumber : ""
        }

    }

    componentWillMount() {
        var _this = this;
        //This is good shit to remember for later
        // AuthService.getUserEmail();
        // AuthService.getUserRole();
        //This sends our credentials in the header

        HttpRequest.httpRequest(constants.getServerUrl() + '/sweng500/getUserProfile', 'GET',
            constants.useCredentials(), null).then(function (result) {
            console.log(result);
            _this.setState({
                user: result.body
            })

        }).catch(function (error) {
            console.log(error);
        })
        //here we will get the user type
        _this.setState({emailAddress: AuthService.getUserEmail()});
        _this.setState({phoneNumber: _this.state.user.phoneNumber})
    }

    componentDidMount() {
        this.setState({_notificationSystem: this.refs.notificationSystem});
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

    sendEmail(e) {
        var body = {};
        var _this = this;

        body.emailAddress = this.state.emailAddress;
        _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + '/sweng500/sendTestEmail', 'POST',
            constants.useCredentials(), body).then(function (result) {

            if (result.status === 200) {
                _this.notify(
                    "Test email sent",
                    "success",
                    "tc",
                    5
                )
            } else if(result.status === 409) {
                _this.notify(
                    "Could not send email",
                    "error",
                    "tc",
                    10
                );
            }

        }).catch(function (error) {
            console.log(error);
        })
    }

    sendText(e) {
        var body = {};
        var _this = this;

        // Create the user account
        var cleanPhoneNumber = this.state.phoneNumber;
        cleanPhoneNumber = cleanPhoneNumber.replace(/\s/g, '');         // Remove spaces
        cleanPhoneNumber = cleanPhoneNumber.replace(/\(|\)/g,'');       // Remove ( and )
        cleanPhoneNumber = cleanPhoneNumber.replace(/-/g,"");           // Remove -
        cleanPhoneNumber = '+' + cleanPhoneNumber;                      // Add +

        body.phoneNumber = cleanPhoneNumber;
        _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + '/sweng500/sendTestText', 'POST',
            constants.useCredentials(), body).then(function (result) {

            if (result.status === 200) {
                _this.notify(
                    "Test text sent",
                    "success",
                    "tc",
                    5
                )
            } else if(result.status === 409) {
                _this.notify(
                    "Could not send text",
                    "error",
                    "tc",
                    10
                );
            }

        }).catch(function (error) {
            console.log(error);
        })
    }

    goToEasterEgg() {
        //This is where I want to launch the easter egg
    }

    render() {
        return (
            <div className="content">
                <NotificationSystem ref="notificationSystem" style={style}/>
                <MuiThemeProvider>
                    <Grid fluid>
                        <Row classname="show-grid">
                            <Col md={12}>
                                <AppBar showMenuIconButton={false} title="Test Email"/>
                            </Col>
                        </Row>
                        <Row classname="show-grid">
                            <Col md={6}>
                                <TextField
                                    name="emailAddress"
                                    hintText="Email Address"
                                    floatingLabelText="Email Address"
                                    onChange={(event, newValue) => this.setState({emailAddress: newValue})}
                                    value={this.state.emailAddress}
                                />
                            </Col>
                            <Col md={6}>
                                <Button
                                    bsStyle="info"
                                    pullRight
                                    fill
                                    type="submit"
                                    onClick={this.sendEmail}
                                >
                                    Send Email
                                </Button>
                            </Col>
                        </Row>
                        <Row classname="show-grid">
                            <Col md={12}>
                                <AppBar showMenuIconButton={false} title="Test Text"/>
                            </Col>
                        </Row>
                        <Row classname="show-grid">
                            <Col md = {6}>
                                <TextField
                                    name="phone"
                                    floatingLabelText="Phone number"
                                    onChange={(event, newValue) => this.setState({phoneNumber: newValue})}
                                    value={this.state.phoneNumber}
                                >
                                    <InputMask mask="9 (999) 999-9999" maskChar="#"
                                               value={this.state.phoneNumber}/>
                                </TextField>
                            </Col>
                            <Col md={6}>
                                <Button
                                    bsStyle="info"
                                    pullRight
                                    fill
                                    type="submit"
                                    onClick={this.sendText}
                                >
                                    Send Text
                                </Button>
                            </Col>
                        </Row>
                        <Row classname="show-grid">
                            <Col md={12}>
                                <AppBar showMenuIconButton={false} title="Easter Egg"/>
                            </Col>
                        </Row>
                        <Row classname="show-grid">
                            <Col md={12}>
                                <Button
                                    bsStyle="info"
                                    pullRight
                                    fill
                                    type="submit"
                                    onClick={this.goToEasterEgg}
                                >
                                    Easter Egg
                                </Button>
                            </Col>
                        </Row>
                    </Grid>
                </MuiThemeProvider>
            </div>
        );
    }
}



export default Extras;
