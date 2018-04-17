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

class UserProfile extends Component {

    constructor(props) {
        super(props);

        this.updateProfile = this.updateProfile.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.validPassword = this.validPassword.bind(this);
        this.cleanPhone = this.cleanPhone.bind(this);
        this.notify = this.notify.bind(this);

        this.state = {
            user : {firstName: "", lastName: "", phoneNumber: "", receiveText: false, minutesBeforeEvent: "0"},
            _notificationSystem : null,
            password: "",
            currentPassword : "",
            newPassword : "",
            confirmPassword : "",
            imageUrl : "",
            desc : "",
            code: 0
        };

    }

    componentWillMount() {
        var _this = this;
        //This is good shit to remember for later
        // AuthService.getUserEmail();
        // AuthService.getUserRole();
        //This sends our credentials in the header

        HttpRequest.httpRequest(constants.getServerUrl() + '/sweng500/getUserProfile', 'GET',
            constants.useCredentials(), null).then(function (result) {
            _this.setState({
                user: result.body,
                desc: result.body.school ? "School: " + result.body.school.schoolName : ""
            })

        }).catch(function (error) {
            console.log(error);
        })
        //here we will get the user type
        const userType = AuthService.getUserRole();

        if (userType === "ADMIN") {
            this.setState({imageUrl : "https://telegram.org/file/811140509/b45/dQTLEwKZ9gs.22232.gif/4580677d940852f30e"});
        } else if (userType === "COACH") {
            this.setState({
                imageUrl : "https://baseballmomstuff.com/wp-content/uploads/2016/02/coach-cartoon.jpg"
            });
        } else if (userType === "JUDGE") {
            this.setState({imageUrl : "https://www.how-to-draw-funny-cartoons.com/image-files/cartoon-judge-010.jpg"});
        } else if (userType === "STUDENT") {
            this.setState({
                imageUrl : "https://classroomclipart.com/images/gallery/Clipart/Science/TN_female-student-holding-flask-and-test-tube-in-science-lab-science-clipart.jpg"
            });
        }
    }

    componentDidMount() {
        this.setState({_notificationSystem: this.refs.notificationSystem});
    }

    notify(message, level, position, autoDismiss) {
        if(this.state._notificationSystem) {
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
    }

    cleanPhone(cleanPhoneNumber) {
        cleanPhoneNumber = cleanPhoneNumber.replace(/\s/g, '');         // Remove spaces
        cleanPhoneNumber = cleanPhoneNumber.replace(/\(|\)/g,'');       // Remove ( and )
        cleanPhoneNumber = cleanPhoneNumber.replace(/-/g,"");           // Remove -
        cleanPhoneNumber = '+' + cleanPhoneNumber;                      // Add +

        return cleanPhoneNumber;
    }

    updateProfile(e) {
        var body = {};
        var _this = this;

        if (this.state.password !== "") {

            body.password = this.state.password;

            //check to ensure the password matches
            _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + '/sweng500/validate', 'POST',
                constants.useCredentials(), body, true).then(function (result) {

                //Create deep copy of user object
                body.user = JSON.parse(JSON.stringify(_this.state.user));

                //update the user, first clean the phone number
                body.user.phoneNumber = _this.cleanPhone(body.user.phoneNumber);

                  _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + '/sweng500/updateUser', 'POST', constants.useCredentials(), body.user, true).then(function (result) {

                      _this.notify(
                          "Profile Successfully Updated",
                          "success",
                          "tc",
                          5
                      );

                      _this.setState({
                          password: ""
                      })

                  }).catch(function (error) {
                      console.log(error);
                      _this.notify(
                          "Could not update profile at this time. Please try again later.",
                          "error",
                          "tc",
                          5
                      );
                    _this.setState({code : 11});
                  })
            }).catch(function (error) {
                console.log(error);
                _this.notify(
                    "Please provide the correct password in order to update your profile.",
                    "error",
                    "tc",
                    5
                )
                _this.setState({code : 14})
            })
        } else {
            _this.notify(
                "Please enter your current password",
                "error",
                "tc",
                5
            );
            _this.setState({code : 1})
        }
    }

    // Check if a passowrd is valid. 8 characters, uppercase, lowercase, and numbers
    validPassword(text) {
        if (text.length < 8) return false;
        var hasUpperCase = /[A-Z]/.test(text);
        var hasLowerCase = /[a-z]/.test(text);
        var hasNumbers = /\d/.test(text);
        var hasNonalphas = /\W/.test(text);
        if (hasUpperCase + hasLowerCase + hasNumbers + hasNonalphas < 3) return false;

        return true;
    }

    changePassword(e) {
        var body = {};
        var _this = this;

        //check to ensure that current password is filled in
        if (this.state.currentPassword !== "" && this.state.newPassword !== "" && this.state.confirmPassword !== "") {

            //check to make sure current password is correct
            if (this.state.newPassword === this.state.confirmPassword) {

                if (this.validPassword(this.state.newPassword)) {

                    body.password = this.state.currentPassword;

                    //ensure their current password is correct
                    _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + '/sweng500/validate', 'POST',
                        constants.useCredentials(), body).then(function (result) {

                        //then change the password
                        body.password = _this.state.newPassword;

                        _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + '/sweng500/changePassword', 'POST',
                            constants.useCredentials(), body).then(function (result) {

                            _this.notify(
                                "Password changed successfully.",
                                "success",
                                "tc",
                                5
                            );

                            _this.setState({currentPassword: "", newPassword: "", confirmPassword: "", code: 8})

                        }).catch(function (error) {
                            console.log(error);

                            _this.notify(
                                "Could not update at this time.  Please try again later.",
                                "error",
                                "tc",
                                7
                            );
                           _this.setState({code : 10})
                        })
                    }).catch(function (error) {
                        _this.notify(
                            "Incorrect current password.  Please provide your current password",
                            "error",
                            "tc",
                            5
                        );

                        _this.setState({code : 7})
                    })
                } else {
                    //put up a notify
                    this.notify(
                        "ERROR: Your password must be 8 or more characters, contain capital letters, lower case letters, and at least one number.",
                        "error",
                        "tc",
                        10
                    );
                    this.setState({code : 4})
                }
            } else {
                //put up a notify
                this.notify(
                    "New passwords do not match",
                    "error",
                    "tc",
                    5
                );
                this.setState({code : 3})
            }
        }
        else {
            this.notify(
                "Please enter your current password, a new password, and confirm the new password.",
                "error",
                "tc",
                7
            );
        }
    }

    render() {
        return (
            <div className="content">
                <NotificationSystem ref="notificationSystem" style={style}/>
                <MuiThemeProvider>
                    <Grid fluid>
                        <Row className="show-grid">
                            <Col md={4}>
                                <UserCard
                                    bgImage="https://ununsplash.imgix.net/photo-1431578500526-4d9613015464?fit=crop&fm=jpg&h=300&q=75&w=400"
                                    //avatar={avatar}
                                    avatar= {this.state.imageUrl}
                                    name= {this.state.user.firstName + " " + this.state.user.lastName}
                                    userName={this.state.user.emailAddress}
                                    //maybe in description put the events they are doing? or school information?
                                    description={<span> {this.state.desc}  </span> }
                                />
                            </Col>
                        </Row>
                        <Row className="show-grid">
                            <Col md={12}>
                                <AppBar showMenuIconButton={false} title="User Profile"/>
                            </Col>
                        </Row>
                        <Row className="show-grid">
                            <Col md={4}>
                                <TextField
                                    name="fname"
                                    hintText="First name"
                                    floatingLabelText="First name"
                                    onChange = {(event, newValue) => { var ryanRocks = this.state.user;
                                        ryanRocks.firstName = event.target.value;
                                        this.setState({user : ryanRocks})}}
                                    value={this.state.user.firstName}
                                />
                            </Col>
                            <Col md={6}>
                                <TextField
                                    name="lname"
                                    hintText="Last name"
                                    floatingLabelText="Last name"
                                    onChange ={ (event, newValue) => {var ryanRocks = this.state.user;
                                        ryanRocks.lastName = event.target.value;
                                        this.setState({user : ryanRocks})}}
                                    value={this.state.user.lastName}
                                />
                            </Col>
                        </Row>
                        <Row className="show-grid">
                            <Col md = {4}>
                                <TextField
                                    name="phone"
                                    floatingLabelText="Phone number"
                                    onChange = {(event, newValue) => {var ryanRocks = this.state.user;
                                        ryanRocks.phoneNumber = event.target.value;
                                        this.setState({user : ryanRocks})}}
                                    value={this.state.user.phoneNumber}
                                >
                                    <InputMask mask="9 (999) 999-9999" maskChar="#"
                                               value={this.state.user.phoneNumber}/>
                                </TextField>
                            </Col>
                            <Col md={4}>
                                <TextField
                                    name="timeBeforeEvent"
                                    hintText="Time Before Event"
                                    floatingLabelText="Time Before Event"
                                    onChange = {(event, newValue) => {var ryanRocks = this.state.user;
                                        ryanRocks.minutesBeforeEvent = event.target.value;
                                        this.setState({user : ryanRocks})}}
                                    value={this.state.user.minutesBeforeEvent}
                                >
                                    <InputMask mask="99" maskChar=""
                                               value={this.state.user.minutesBeforeEvent}/>
                                </TextField>
                            </Col>
                        </Row>
                        <Row className="show-grid">
                            <Col md={4}>

                            </Col>
                            <Col md={6}>
                                <PasswordField
                                    name="currentPassword"
                                    id="password"
                                    // hintText="Current Password"
                                    floatingLabelText="Current Password"
                                    onChange={(event, newValue) => this.setState({password: newValue})}
                                    value={this.state.password}
                                />
                            </Col>
                        </Row>
                        <Row className="show-grid">
                            <Col md={4}>
                                <input
                                    name="receiveText"
                                    type="checkbox"
                                    checked={this.state.user.receiveText}
                                    onChange={(event, newValue) => {var ryanRocks = this.state.user;
                                        // console.log(event.target.value);
                                        ryanRocks.receiveText = !ryanRocks.receiveText; //; ?  true : false);
                                        this.setState({user : ryanRocks})}} />
                                <label>
                                    Receive Text Messages
                                </label>
                            </Col>
                            <Col md={2}>
                                <Button
                                    bsStyle="info"
                                    pullRight
                                    fill
                                    type="submit"
                                    onClick={this.updateProfile}
                                >
                                    Update Profile
                                </Button>
                            </Col>
                        </Row>
                        <Row className={"show-grid"}>
                            <label>

                            </label>
                        </Row>
                        <Row className={"show-grid"}>
                            <AppBar showMenuIconButton={false} title="Change Password"/>
                        </Row>
                        <Row className={"show-grid"}>
                            <Col md={12}>
                                <PasswordField
                                    name="currentPassword"
                                    id="currentPassword"
                                    // hintText="Current Password"
                                    floatingLabelText="Current Password"
                                    onChange={(event, newValue) => this.setState({currentPassword: newValue})}
                                    value={this.state.currentPassword}
                                />
                            </Col>
                        </Row>
                        <Row className={"show-grid"}>
                            <Col md={12}>
                                <PasswordField
                                    name="newPassword"
                                    id="newPassword"
                                    // hintText="New Password"
                                    floatingLabelText="New Password"
                                    onChange={(event, newValue) => this.setState({newPassword: newValue})}
                                    value={this.state.newPassword}
                                />
                            </Col>
                        </Row>
                        <Row className={"show-grid"}>
                            <Col md={12}>
                                <PasswordField
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    // hintText="Confirm Password"
                                    floatingLabelText="Confirm Password"
                                    onChange={(event, newValue) => this.setState({confirmPassword: newValue})}
                                    value={this.state.confirmPassword}
                                />
                            </Col>
                        </Row>
                        <Row className={"show-grid"}>
                            <Col md={6}>
                                <Button
                                    bsStyle="info"
                                    pullRight
                                    fill
                                    type="submit"
                                    onClick={this.changePassword}
                                >
                                    Change Password
                                </Button>
                            </Col>
                        </Row>
                    </Grid>
                </MuiThemeProvider>
            </div>
        );
    }
}



export default UserProfile;
