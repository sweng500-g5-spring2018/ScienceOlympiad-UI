import React, { Component } from 'react';
import {
    Grid, Row, Col,
} from 'react-bootstrap';

import InputMask from 'react-input-mask';
import Button from '../../elements/CustomButton/CustomButton.js';

import {TextField} from "material-ui";
import HttpRequest from "../../adapters/httpRequest";
import constants from "../../utils/constants";
import NotificationSystem from 'react-notification-system';
import {style} from "../../variables/Variables";
import AppBar from 'material-ui/AppBar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Sudoku from 'sudoku-react-component';
import {Panel, PanelGroup} from 'react-bootstrap';

class Extras extends React.Component {

    constructor(props) {
        super(props);

        this.sendEmail = this.sendEmail.bind(this);
        this.sendText = this.sendText.bind(this);
        this.handleSelect = this.handleSelect.bind(this);

        this.state = {
            user : {},
            _notificationSystem : null,
            emailAddress : "",
            phoneNumber : "",
            activeKey: '1'
        };
    }

    // componentWillMount() {
    //     var _this = this;
        //This is good shit to remember for later
        // AuthService.getUserEmail();
        // AuthService.getUserRole();
        //This sends our credentials in the header

        // HttpRequest.httpRequest(constants.getServerUrl() + '/sweng500/getUserProfile', 'GET',
        //     constants.useCredentials(), null).then(function (result) {
        //     console.log(result);
        //     _this.setState({
        //         user: result.body
        //     });
        //
        // }).catch(function (error) {
        //     console.log(error);
        // })
        //here we will get the user type
    // }

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

    handleSelect(activeKey) {
        this.setState({ activeKey });
    }


    sendEmail(e) {
        var body = {};
        var _this = this;

        body.emailAddress = this.state.emailAddress;
        _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + '/sweng500/sendTestEmail', 'POST',
            constants.useCredentials(), body).then(function (result) {
            _this.setState({emailAddress: ""});
            _this.notify(
                "Test email sent",
                "success",
                "tc",
                5
            )
        }).catch(function (error) {
            _this.notify(
                "Could not send email because: " + error.message,
                "error",
                "tc",
                10
            );
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
            _this.setState({phoneNumber: ""});
            _this.notify(
                "Test text sent",
                "success",
                "tc",
                5
            )

        }).catch(function (error) {
            _this.notify(
                "Could not send text because: " + error.message,
                "error",
                "tc",
                10
            );
        })
    }

    render() {
        return (
            <div className="content">
                <NotificationSystem ref="notificationSystem" style={style}/>
                <MuiThemeProvider>
                    <Grid fluid>
                        <PanelGroup accordion
                                    activeKey={this.state.activeKey}
                                    onSelect={this.handleSelect}>
                            <Panel id="email-panel" eventKey="1">
                                <Panel.Heading  style={{backgroundColor: '#194287'}}>
                                    <Panel.Title toggle style={{color: 'white'}}>
                                        Test Email Functionality
                                    </Panel.Title>
                                </Panel.Heading>
                                <Panel.Collapse>
                                    <Panel.Body collapsible>
                                        <TextField
                                            name="emailAddress"
                                            hintText="Email Address"
                                            floatingLabelText="Email Address"
                                            onChange={(event, newValue) => this.setState({emailAddress: newValue})}
                                            value={this.state.emailAddress}
                                        />
                                        {    }
                                        <Button
                                            bsStyle="info"
                                            fill
                                            type="submit"
                                            onClick={this.sendEmail}
                                            style={{backgroundColor: '#194287', borderColor : '#194287'}}
                                        >
                                            Send Email
                                        </Button>
                                    </Panel.Body>
                                </Panel.Collapse>
                            </Panel>
                            <Panel id="text-panel" eventKey="2">
                                <Panel.Heading  style={{backgroundColor: '#194287'}}>
                                    <Panel.Title toggle style={{color: 'white'}}>
                                        Test SMS Texting Functionality
                                    </Panel.Title>
                                </Panel.Heading>
                                <Panel.Collapse>
                                    <Panel.Body collapsible>
                                        <TextField
                                            name="phone"
                                            floatingLabelText="Phone number"
                                            onChange={(event, newValue) => this.setState({phoneNumber: newValue})}
                                            value={this.state.phoneNumber}
                                        >
                                            <InputMask mask="9 (999) 999-9999" maskChar="#"
                                                       value={this.state.phoneNumber}/>
                                        </TextField>
                                        {    }
                                        <Button
                                            bsStyle="info"
                                            fill
                                            type="submit"
                                            onClick={this.sendText}
                                            style={{backgroundColor: '#194287', borderColor : '#194287'}}
                                        >
                                            Send Text
                                        </Button>
                                    </Panel.Body>
                                </Panel.Collapse>
                            </Panel>
                            <Panel id="egg-panel" eventKey="3">
                                <Panel.Heading  style={{backgroundColor: '#194287'}}>
                                    <Panel.Title toggle style={{color: 'white'}}>
                                        Easter Egg
                                    </Panel.Title>
                                </Panel.Heading>
                                <Panel.Collapse>
                                    <Panel.Body collapsible>
                                        <div id='sudoku-container' style={{width : '70%', paddingLeft:'10%', paddingRight:'0%'}}>
                                            <Sudoku />
                                        </div>
                                    </Panel.Body>
                                </Panel.Collapse>
                            </Panel>
                        </PanelGroup>
                    </Grid>
                </MuiThemeProvider>
            </div>
        );
    }
}



export default Extras;
