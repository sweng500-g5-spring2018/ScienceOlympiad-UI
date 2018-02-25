import React, { Component } from 'react';
import {
    Grid, Row, Col,
    FormGroup, ControlLabel, FormControl
} from 'react-bootstrap';

import {Card} from '../../components/Card/Card.js';
import {FormInputs} from '../../components/FormInputs/FormInputs.js';
import {UserCard} from '../../components/UserCard/UserCard.js';
import InputMask from 'react-input-mask';
import Button from '../../elements/CustomButton/CustomButton.js';

import avatar from "../../assets/img/faces/face-0.jpg";
import {TextField} from "material-ui";
import HttpRequest from "../../adapters/httpRequest";
import constants from "../../utils/constants";

class UserProfile extends React.Component {

    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.validPassword = this.validPassword.bind(this);

        this.state = {
            id                  : "id12034",
            firstName           : "Kyle",
            lastName            : "Kevin",
            emailAddress        : "KyleKevin@momsbasement.com",
            phoneNumber         : "18005263277",
            receiveText         : true,
            minutesBeforeEvent  : 10
        }
    }

    handleChange(e) {
        this.setState({ receiveText: !this.state.receiveText });
    }

    updateProfile(e) {
        var body = {};
        var _this = this;

        body.firstName = this.state.firstName;
        body.lastName = this.state.lastName;
        body.emailAddress = this.state.emailAddress;
        body.phoneNumberString = this.state.phoneNumber;
        body.password = this.state.password;
        body.receiveText = this.state.receiveText;
        body.minutesBeforeEvent = this.state.minutesBeforeEvent;


        if (this.state.password !== "") {
            //check to ensure the password matches
            _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + '/sweng500/validate?_id=' + this.state.id, 'POST', null, body).then(function (result) {

                if (result.status === 200) {
                    _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + '/sweng500/updateUser?_id=' + this.state.id, 'POST', null, body).then(function (result) {
                        console.log(result);

                        if (result.status === 200) {
                            //use the app.notify to put something on the screen
                            this.props.notify(
                                "Profile Successfully Updated",
                                "success",
                                "tc",
                                5
                            )
                        }else if(result.status === 409) {
                            this.props.notify(
                                "Could not update",
                                "error",
                                "tc",
                                10
                            )
                        }

                    }).catch(function (error) {
                        console.log(error);
                    })
                } else if(result.status === 401) {
                    this.props.notify(
                        "Incorrect password",
                        "error",
                        "tc",
                        10
                    )
                }

            }).catch(function (error) {
                console.log(error);
            })
        } else {
            this.props.notify(
                "Enter your current password",
                "error",
                "tc",
                5
            )
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
        if (this.state.currentPassword !== "" && this.state.newPassword !== "" && this.state.confirmNewPassword) {

            //check to make sure current password is correct
            if (this.state.newPassword === this.state.confirmNewPassword) {
                if (this.validPassword(this.state.newPassword)) {

                    //ensure their current password is correct
                    _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + '/sweng500/validate?_id=' + this.state.id, 'POST', null, body).then(function (result) {

                        if (result.status === 200) {
                            //then change the password
                            body.newPassword = this.state.newPassword;

                            _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + '/sweng500/changePassword?_id=' + this.state.id, 'POST', null, body).then(function (result) {
                                console.log(result);

                                if (result.status === 200) {
                                    this.props.notify(
                                        "Password Changed",
                                        "success",
                                        "tc",
                                        5
                                    )
                                }else if(result.status === 409) {
                                    this.props.notify(
                                        "Could not update",
                                        "error",
                                        "tc",
                                        10
                                    )
                                }

                            }).catch(function (error) {
                                console.log(error);
                            })
                        } else if (result.status === 401) {
                            this.props.notify(
                                "Incorrect current password",
                                "error",
                                "tc",
                                10
                            )
                        }
                    }).catch(function (error) {
                        console.log(error);
                    })
                } else {
                    //put up a notify
                    this.props.notify(
                        "ERROR: Your password must be 8 or more characters, contain capital letters, lower case letters, and at least one number.",
                        "error",
                        "tc",
                        10
                    );
                }
            } else {
                //put up a notify
                this.props.notify(
                    "New passwords do not match",
                    "error",
                    "tc",
                    5
                )
            }

        }
    }



    render() {
        return (
            <div className="content">
                <Grid fluid>
                    <Row>
                        {/*<Col md={4}>*/}
                        {/*<UserCard*/}
                        {/*bgImage="https://ununsplash.imgix.net/photo-1431578500526-4d9613015464?fit=crop&fm=jpg&h=300&q=75&w=400"*/}
                        {/*avatar={avatar}*/}
                        {/*name= {this.state.firstName + " " + this.state.lastName}*/}
                        {/*//maybe in description put the events they are doing? or school information?*/}
                        {/*description={*/}
                        {/*<span>*/}
                        {/*"I am*/}
                        {/*<br />*/}
                        {/*the worst person*/}
                        {/*<br />*/}
                        {/*you have ever met"*/}
                        {/*</span>*/}
                        {/*}*/}
                        {/*socials={*/}
                        {/*<div>*/}
                        {/*<Button simple><i className="fa fa-facebook-square"></i></Button>*/}
                        {/*<Button simple><i className="fa fa-twitter"></i></Button>*/}
                        {/*<Button simple><i className="fa fa-google-plus-square"></i></Button>*/}
                        {/*</div>*/}
                        {/*}*/}
                        {/*/>*/}
                        {/*</Col>*/}
                        <Col md={8}>
                            <Card
                                title="Edit Profile"
                                content={
                                    <form>
                                        <FormInputs
                                            ncols = {["col-md-5" , "col-md-7"]}
                                            proprieties = {[
                                                {
                                                    label : "School Name ",
                                                    type : "text",
                                                    bsClass : "form-control",
                                                    placeholder : "Company",
                                                    defaultValue : "Penn State Univ.",
                                                    //onChange : {(event, newValue) => this.setState({firstName: newValue})}
                                                    disabled : true
                                                },
                                                {
                                                    label : "Email address",
                                                    type : "email",
                                                    bsClass : "form-control",
                                                    placeholder : "Email",
                                                    defaultValue : "KyleKevin@momsbasement.com",
                                                    value : this.state.emailAddress,
                                                    disabled: true
                                                }
                                            ]}
                                        />
                                        <FormInputs
                                            ncols = {["col-md-6" , "col-md-6"]}
                                            proprieties = {[
                                                {
                                                    label : "First name",
                                                    type : "text",
                                                    bsClass : "form-control",
                                                    placeholder : "First name",
                                                    value : this.state.firstName,
                                                    onChange : (event, newValue) => {this.setState({ firstName: newValue })},
                                                    defaultValue : "Kyle"
                                                },
                                                {
                                                    label : "Last name",
                                                    type : "text",
                                                    bsClass : "form-control",
                                                    placeholder : "Last name",
                                                    value : this.state.lastName,
                                                    onChange : (event, newValue) => {this.setState({ lastName: newValue })},
                                                    defaultValue : "Kevin"
                                                }
                                            ]}
                                        />
                                        <FormInputs
                                            ncols = {["col-md-5" , "col-md-3" , "col-md-4"]}
                                            proprieties = {[
                                                {
                                                    label: "Phone Number",
                                                    type: "text",
                                                    bsClass: "form-control",
                                                    placeholder: "Phone Number",
                                                    defaultValue: "+1-555-555-5555",
                                                    onChange : (event, newValue) => {this.setState({ phoneNumber: newValue })},
                                                    value : this.state.phoneNumber
                                                },
                                                {
                                                    label : "Receive Texts",
                                                    type : "checkbox",
                                                    bsClass : "form-control",
                                                    placeholder : "Receive Text Messages",
                                                    checked: this.state.receiveText ? 'checked' : '',
                                                    onChange : event => {this.setState({ receiveText: !this.state.receiveText })},
                                                    value: this.state.receiveText
                                                },
                                                {
                                                    ref : "Time Before Event",
                                                    label : "Time Before Event",
                                                    type : "number",
                                                    bsClass : "form-control",
                                                    placeholder : "Time Before Event",
                                                    tooltip : "Time before event to receive test, in minutes",
                                                    value : this.state.minutesBeforeEvent,
                                                    onChange : (event, newValue) => {this.setState({ minutesBeforeEvent: newValue })},
                                                    defaultValue : 10
                                                }
                                            ]}
                                        />
                                        <FormInputs
                                            ncols = {["col-md-6"]}
                                            proprieties = {[
                                                {
                                                    label: "Current Password",
                                                    type: "password",
                                                    bsClass : "form-control",
                                                    placeholder: "Current Password",
                                                    value : this.state.password,
                                                    onChange : (event, newValue) => {this.setState({ password: newValue })},
                                                }
                                            ]}
                                        />

                                        {/*<Row>*/}
                                        {/*<Col md={12}>*/}
                                        {/*<FormGroup controlId="formControlsTextarea">*/}
                                        {/*<ControlLabel>About Me</ControlLabel>*/}
                                        {/*<FormControl rows="5" componentClass="textarea" bsClass="form-control" placeholder="Here can be your description" defaultValue="About me... idk..."/>*/}
                                        {/*</FormGroup>*/}
                                        {/*</Col>*/}
                                        {/*</Row>*/}
                                        <Button
                                            bsStyle="info"
                                            pullRight
                                            fill
                                            type="submit"
                                            onClick={this.updateProfile}
                                        >
                                            Update Profile
                                        </Button>
                                        <div className="clearfix"></div>
                                    </form>
                                }
                            />
                            <Card
                                title="Change Password"
                                content={
                                    <form>
                                        <FormInputs
                                            ncols = {["col-md-8"]}
                                            proprieties = {[
                                                {
                                                    label: "Current Password",
                                                    type: "password",
                                                    bsClass : "form-control",
                                                    placeholder: "Current Password",
                                                    value : this.state.currentPassword,
                                                    onChange : (event, newValue) => {this.setState({ currentPassword: newValue })},
                                                }
                                            ]}
                                        />
                                        <FormInputs
                                            ncols = {["col-md-8"]}
                                            proprieties = {[
                                                {
                                                    label: "New Password",
                                                    type: "password",
                                                    bsClass : "form-control",
                                                    placeholder: "New Password",
                                                    value : this.state.newPassword,
                                                    onChange : (event, newValue) => {this.setState({newPassword: newValue })},
                                                }
                                            ]}
                                        />
                                        <FormInputs
                                            ncols = {["col-md-8"]}
                                            proprieties = {[
                                                {
                                                    label: "Confirm New Password",
                                                    type: "password",
                                                    bsClass : "form-control",
                                                    placeholder: "Confirm New Password",
                                                    value : this.state.confirmNewPassword,
                                                    onChange : (event, newValue) => {this.setState({ confirmNewPassword: newValue })},
                                                }
                                            ]}
                                        />
                                        <Button
                                            bsStyle="info"
                                            pullRight
                                            fill
                                            type="submit"
                                            onClick={this.changePassword}
                                        >
                                            Change Password
                                        </Button>
                                    </form>
                                }
                            />
                        </Col>


                    </Row>
                </Grid>
            </div>
        );
    }
}

export default UserProfile;
