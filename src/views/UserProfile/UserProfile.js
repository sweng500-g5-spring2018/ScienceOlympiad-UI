import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
import AuthService from "../../containers/Login/AuthService";
import NotificationSystem from 'react-notification-system';
import {style} from "../../variables/Variables";


class UserProfile extends React.Component {

    constructor(props) {
        super(props);

        this.updateProfile = this.updateProfile.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.validPassword = this.validPassword.bind(this);

        this.state = {
            user : {},
            _notificationSystem : null,
            currentPassword : "",
            newPassword : "",
            confirmNewPassword : "",
            imageUrl : "",
            desc : ""
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
        const userType = AuthService.getUserRole();
        console.log(userType);
        if (userType === "ADMIN") {
            this.state.imageUrl = "https://telegram.org/file/811140509/b45/dQTLEwKZ9gs.22232.gif/4580677d940852f30e";
        } else if (userType === "COACH") {
            this.state.imageUrl = "https://baseballmomstuff.com/wp-content/uploads/2016/02/coach-cartoon.jpg";
            this.state.desc = "School: " + this.state.user.school;
        } else if (userType === "JUDGE") {
            this.state.imageUrl = "https://www.how-to-draw-funny-cartoons.com/image-files/cartoon-judge-010.jpg";
        } else if (userType === "STUDENT") {
            this.state.imageUrl = "https://classroomclipart.com/images/gallery/Clipart/Science/TN_female-student-holding-flask-and-test-tube-in-science-lab-science-clipart.jpg";
            this.state.desc = "Coach: " + this.state.user.coach;
        }
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

    updateProfile(e) {
        var body = {};
        var _this = this;

        body.user = this.state.user;

        if (this.state.password !== "") {
            //check to ensure the password matches
            _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + '/sweng500/validate?_id=' +
                this.state.id, 'POST', null, body).then(function (result) {

                if (result.status === 200) {
                    _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + '/sweng500/updateUser?_id=' +
                        this.state.id, 'POST', null, body).then(function (result) {

                        console.log(result);

                        if (result.status === 200) {
                            //use the app.notify to put something on the screen
                            this.notify(
                                "Profile Successfully Updated",
                                "success",
                                "tc",
                                5
                            )
                        }else if(result.status === 409) {
                            this.notify(
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
                    this.notify(
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
            this.notify(
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
                                    this.notify(
                                        "Password Changed",
                                        "success",
                                        "tc",
                                        5
                                    )
                                }else if(result.status === 409) {
                                    this.notify(
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
                            this.notify(
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
                    this.notify(
                        "ERROR: Your password must be 8 or more characters, contain capital letters, lower case letters, and at least one number.",
                        "error",
                        "tc",
                        10
                    );
                }
            } else {
                //put up a notify
                this.notify(
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
                <NotificationSystem ref="notificationSystem" style={style}/>
                <Grid fluid>
                    <Row>
                        <Col md={4}>
                            <UserCard
                                bgImage="https://ununsplash.imgix.net/photo-1431578500526-4d9613015464?fit=crop&fm=jpg&h=300&q=75&w=400"
                                //avatar={avatar}
                                avatar= {this.state.imageUrl}
                                name= {this.state.user.firstName + " " + this.state.user.lastName}
                                userName={this.state.user.emailAddress}
                                //maybe in description put the events they are doing? or school information?
                                description={<span> {this.state.desc} </span> }
                         //           <span>
                         //               "I is
                         //               <br />
                         //               the worst person
                         //               <br />
                         //               you have ever met"
                         //           </span>


                                // socials={
                                //     <div>
                                //         <Button
                                //             bsStyle="info"
                                //             fill
                                //             type="submit"
                                //             onClick={"http:www.facebook.com"}>
                                //             <i className="fa fa-facebook-square"></i></Button>
                                //         <Button simple><i className="fa fa-twitter"></i></Button>
                                //         <Button simple><i className="fa fa-google-plus-square"></i></Button>
                                //     </div>
                                // }
                            />
                        </Col>
                        <Col md={8}>
                            <Card
                                title="Edit Profile"
                                content={
                                    <form>
                                        {/*<FormInputs*/}
                                        {/*ncols = {["col-md-5" , "col-md-7"]}*/}
                                        {/*proprieties = {[*/}
                                        {/*{*/}
                                        {/*label : "School Name ",*/}
                                        {/*type : "text",*/}
                                        {/*bsClass : "form-control",*/}
                                        {/*placeholder : "Company",*/}
                                        {/*defaultValue : "Penn State Univ.",*/}
                                        {/*//onChange : {(event, newValue) => this.setState({firstName: newValue})}*/}
                                        {/*disabled : true*/}
                                        {/*},*/}
                                        {/*{*/}
                                        {/*label : "Email address",*/}
                                        {/*type : "email",*/}
                                        {/*bsClass : "form-control",*/}
                                        {/*placeholder : "Email",*/}
                                        {/*defaultValue : "KyleKevin@momsbasement.com",*/}
                                        {/*value : this.state.user.emailAddress ? this.state.user.emailAddress : "",*/}
                                        {/*disabled: true*/}
                                        {/*}*/}
                                        {/*]}*/}
                                        {/*/>*/}
                                        <FormInputs
                                            ncols = {["col-md-6" , "col-md-6"]}
                                            proprieties = {[
                                                {
                                                    label : "First name",
                                                    type : "text",
                                                    bsClass : "form-control",
                                                    placeholder : "First name",
                                                    value : this.state.user.firstName,
                                                    onChange : (event, newValue) => {var ryanRocks = this.state.user;
                                                        ryanRocks.firstName = event.target.value;
                                                        this.setState({user : ryanRocks})}
                                                },
                                                {
                                                    label : "Last name",
                                                    type : "text",
                                                    bsClass : "form-control",
                                                    placeholder : "Last name",
                                                    value : this.state.user.lastName ? this.state.user.lastName : "",
                                                    onChange : (event, newValue) => {var ryanRocks = this.state.user;
                                                        ryanRocks.lastName = event.target.value;
                                                        this.setState({user : ryanRocks})}
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
                                                    onChange : (event, newValue) => {var ryanRocks = this.state.user;
                                                        ryanRocks.phone = event.target.value;
                                                        this.setState({user : ryanRocks})},
                                                    value : this.state.user.phoneNumber //? this.state.user.phoneNumber : ""
                                                },
                                                {
                                                    label : "Receive Texts",
                                                    type : "checkbox",
                                                    bsClass : "form-control",
                                                    placeholder : "Receive Texts",
                                                    // checked: this.state.user.receiveText ? 'checked' : '',
                                                    onChange : (event, newValue) => {var ryanRocks = this.state.user;
                                                        // console.log(event.target.value);
                                                        ryanRocks.receiveText = !ryanRocks.receiveText; //; ?  true : false);
                                                        this.setState({user : ryanRocks})},
                                                    value: this.state.user.receiveText
                                                },
                                                {
                                                    label : "Time Before Event",
                                                    type : "number",
                                                    bsClass : "form-control",
                                                    placeholder : "Time Before Event",
                                                    tooltip : "Time before event to receive test, in minutes",
                                                    value : this.state.user.minutesBeforeEvent,
                                                    onChange : (event, newValue) => {var ryanRocks = this.state.user;
                                                        ryanRocks.minutesBeforeEvent = event.target.value;
                                                        this.setState({user : ryanRocks})}
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
