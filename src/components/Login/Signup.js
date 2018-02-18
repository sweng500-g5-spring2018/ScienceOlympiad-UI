import React from 'react';
import {
    Step,
    Stepper,
    StepLabel,
    StepContent,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';
import AppBar from 'material-ui/AppBar';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import InputMask from 'react-input-mask'
import {Row, Col, Grid} from 'react-bootstrap';
import HttpRequest from '../../adapters/httpRequest';
import constants from '../../utils/constants';
import PasswordField from 'material-ui-password-field'

class Signup extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            finished: false,
            stepIndex: 0,
            firstName: '',
            lastName: '',
            phoneNumber: '',
            emailAddress: '',
            password: '',
            confirm: '',
            district: '',
            httpResponse: '',
            accountMessage: '',
            districtList: {}
        };
    }

    componentDidMount() {
        var _this = this;

        _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + '/sweng500/getSchools', 'GET', null, null).then(function (result) {
            console.log(result);
            _this.state.districtList = result.body;

        }).catch(function (error) {
            console.log(error);
        })
    }

    renderIfDistrictFound() {
        if (this.state.test !== null && Object.keys(this.state.districtList).length !== 0) {
            return(
                <SelectField
                    hintText="Select your district"
                    errorText={this.state.districtRequired}
                    floatingLabelText="School District"
                    onChange={(event, index, value) => this.setState({district: value})}
                    maxHeight={200}
                    value={this.state.district}>
                    {
                        Object.keys(this.state.districtList).map(function (key) {
                            return (
                                <MenuItem key={this.state.districtList[key].id} primaryText={this.state.districtList[key].schoolName} value={this.state.districtList[key].id}/>
                            )
                        }, this)

                    }
                        <MenuItem primaryText="Berwick" value='1'/>
                </SelectField>
            )
        }
        else
            return("ERROR")
    }

    // Checks to see if an email has a host, @ symbols, and domain.
    validEmail(text) {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(text) === false)
            return true;
        else
            return false;
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

    // Handles the next button
    handleNext = () => {
        const {stepIndex} = this.state;

        // Flag to indicate if we can proceed
        var missingInfo = false;


        // Form page 1
        if (stepIndex === 0) {

            // Checks first name
            if (this.state.firstName.trim()) {
                this.setState({
                    firstName: this.state.firstName.trim(),
                    firstNameRequired: undefined
                })
            }
            else {
                this.setState({
                    firstName: this.state.firstName.trim(),
                    firstNameRequired: "First name is required."
                })
                missingInfo = true;
            }

            // Checks last name
            if (this.state.lastName.trim()) {
                this.setState({
                    lastName: this.state.lastName.trim(),
                    lastNameRequired: undefined
                })
            }
            else {
                this.setState({
                    lastName: this.state.lastName.trim(),
                    lastNameRequired: "Last name is required."
                })
                missingInfo = true;
            }

            // Checks phone number
            if (this.state.phoneNumber.trim()) {
                this.setState({
                    phoneNumber: this.state.phoneNumber.trim(),
                    phoneNumberRequired: undefined
                })
            }
            else {
                this.setState({
                    phoneNumber: this.state.phoneNumber.trim(),
                    phoneNumberRequired: "A phone number is required."
                })
                missingInfo = true;
            }

            // Checks emails address is not blank
            if (this.state.emailAddress.trim()) {

                // If the address is not valid
                if (this.validEmail(this.state.emailAddress.trim())) {
                    this.setState({
                        emailAddress: this.state.emailAddress.trim(),
                        emailAddressRequired: "A valid email address is required."
                    })

                    missingInfo = true;
                }
                else {

                    // Check to see if the email address already exists
                    var _this = this;
                    var body = {};
                    body.emailAddress = this.state.emailAddress;

                    _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + '/sweng500/emailAvailable', 'POST', null, body ).then(function (result) {
                        console.log(result);

                        _this.setState({
                            emailAddress: _this.state.emailAddress.trim(),
                            emailAddressRequired: "",
                            httpResponse: result,
                        })

                        if (missingInfo === false)
                        {
                            _this.setState({
                                stepIndex: stepIndex + 1
                            })
                        }

                    }).catch(function (error) {
                        console.log(error);

                        if (_this.state.httpResponse.status !== 200)
                            missingInfo = true;

                        _this.setState({
                            emailAddress: _this.state.emailAddress.trim(),
                            emailAddressRequired: "This address has already been registered.",
                            httpResponse: error
                        })
                    })
                }

            }
            else {
                this.setState({
                    emailAddress: this.state.emailAddress.trim(),
                    emailAddressRequired: "An email address is required."
                })
                missingInfo = true;
            }


        } // Form page 2
        else if (stepIndex === 1) {

            // Checks for blank password
            if (this.state.password.trim()) {
                this.setState({
                    password: this.state.password.trim(),
                    passwordRequired: undefined
                })
            }
            else {
                this.setState({
                    password: this.state.password.trim(),
                    passwordRequired: "A password is required."
                })
                missingInfo = true;
            }

            // Checks for blank confirmation password
            if (this.state.confirm.trim()) {
                this.setState({
                    confirm: this.state.confirm.trim(),
                    confirmRequired: undefined
                })
            }
            else {
                this.setState({
                    confirm: this.state.confirm.trim(),
                    confirmRequired: "A password confirmation is required."
                })
                missingInfo = true;
            }

            // Checks to see if the passwords are equal to each other
            if (this.state.password.trim() !== this.state.confirm.trim()) {
                this.setState({
                    confirmRequired: "Passwords must match.",
                    passwordRequired: "Passwords must match."
                })
                this.props.notify(
                    "ERROR: Your passwords do not match.",
                    "error",
                    "tc",
                    6
                );
                missingInfo = true;
            }
            else {
                // Tests the password complexity
                if (this.validPassword(this.state.password.trim())) {
                    this.setState({
                        password: this.state.password.trim(),
                        passwordRequired: undefined
                    })
                }
                else {
                    this.props.notify(
                        "ERROR: Your password must be 8 or more characters, contain capital letters, lower case letters, and at least one number.",
                        "error",
                        "tc",
                        10
                    );
                    this.setState({
                        confirmRequired: "A complex password is required.",
                        passwordRequired: "A complex password is required."
                    })

                    missingInfo = true;
                }
            }

            if (this.state.district.trim() === '')
            {
                this.setState({
                    districtRequired: "Please select your school district."
                })
            }
            else {
                this.setState({districtRequired: undefined})
            }

            if (!missingInfo) {

                this.setState({
                    stepIndex: stepIndex + 1,
                    finished: stepIndex >= 2,
                });

                // Create the user account
                var _this = this;
                var body = {};

                var cleanPhoneNumber = this.state.phoneNumber;
                cleanPhoneNumber = cleanPhoneNumber.replace(/\s/g, '');         // Remove spaces
                cleanPhoneNumber = cleanPhoneNumber.replace(/\(|\)/g,'');       // Remove ( and )
                cleanPhoneNumber = cleanPhoneNumber.replace(/-/g,"");           // Remove -
                cleanPhoneNumber = '+' + cleanPhoneNumber;                      // Add +

                body.firstName = this.state.firstName;
                body.lastName = this.state.lastName;
                body.emailAddress = this.state.emailAddress;
                body.phoneNumberString = cleanPhoneNumber;
                body.password = this.state.password;
                var schoolID = this.state.district;

                _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + '/sweng500/addUser/?userType=COACH&schoolID=' + _this.state.district, 'POST', null, body ).then(function (result) {
                    console.log(result);

                    if (result.status === 200)
                        _this.state.accountMessage = "Congratulations. Your account has been created. Please return to the login screen."

                }).catch(function (error) {
                    console.log(error);

                    _this.state.accountMessage = "There was an error creating your account. Please try again later."

                })

            }

        }

    };

    handlePrev = () => {
        const {stepIndex} = this.state;

        if (stepIndex > 0) {
            this.setState({stepIndex: stepIndex - 1});
        }
    };

    render() {
        const {finished, stepIndex} = this.state;
        const contentStyle = {margin: '0 16px'};
        let myData = this.state.districtList;
        return (
            <MuiThemeProvider>
                <div>
                    <AppBar showMenuIconButton={false} title="Account Registration"/>
                    <Stepper activeStep={stepIndex} orientation={'vertical'} style={{maxWidth: 700, margin: '0',border: '1 solid black'}}>
                        <Step>
                            <StepLabel>Personal Information</StepLabel>
                            <StepContent>
                                <Grid>
                                    <Row className="show-grid">
                                        <Col xs={7} md={3}>
                                            <TextField
                                                hintText="Enter your first name"
                                                errorText={this.state.firstNameRequired}
                                                floatingLabelText="First name"
                                                onChange={(event, newValue) => this.setState({firstName: newValue})}
                                                value={this.state.firstName}
                                                fullWidth={true}
                                                required={true}/>
                                        </Col>
                                        <Col xs={7} md={3}>
                                            <TextField
                                                hintText="Enter your last name"
                                                errorText={this.state.lastNameRequired}
                                                floatingLabelText="Last name"
                                                onChange={(event, newValue) => this.setState({lastName: newValue})}
                                                value={this.state.lastName}
                                                fullWidth={true}
                                                required={true}/>
                                        </Col>
                                    </Row>
                                    <Row className="show-grid">
                                        <Col xs={7} md={3}>
                                            <TextField
                                                errorText={this.state.phoneNumberRequired}
                                                floatingLabelText="Phone number"
                                                onChange={(event, newValue) => this.setState({phoneNumber: newValue})}
                                                value={this.state.phoneNumber}
                                                fullWidth={true}
                                                required={true}>

                                                <InputMask mask="1 (999) 999-9999" maskChar="#"
                                                           value={this.state.phoneNumber}/>
                                            </TextField>
                                        </Col>
                                        <Col xs={7} md={3}>
                                            <TextField
                                                hintText="Enter your email address"
                                                errorText={this.state.emailAddressRequired}
                                                floatingLabelText="Email address"
                                                onChange={(event, newValue) => this.setState({emailAddress: newValue})}
                                                value={this.state.emailAddress}
                                                fullWidth={true}
                                                required={true}/>
                                        </Col>
                                    </Row>
                                </Grid>
                            </StepContent>
                        </Step>
                        <Step>
                            <StepLabel>Account Information</StepLabel>
                            <StepContent>
                                <Grid>
                                    <Row className="show-grid">
                                        <Col xs={7} md={3}>
                                            <PasswordField
                                                type="password"
                                                hintText="Enter your password"
                                                errorText={this.state.passwordRequired}
                                                floatingLabelText="Password"
                                                onChange={(event, newValue) => this.setState({password: newValue})}
                                                value={this.state.password}
                                                fullWidth={true}
                                                required={true}/>
                                        </Col>
                                        <Col xs={7} md={3}>
                                            <PasswordField
                                                type="password"
                                                hintText="Confirm your password"
                                                errorText={this.state.confirmRequired}
                                                floatingLabelText="Confirm your password"
                                                onChange={(event, newValue) => this.setState({confirm: newValue})}
                                                value={this.state.confirm}
                                                fullWidth={true}
                                                required={true}/>
                                        </Col>
                                    </Row>
                                    <Row className="show-grid">
                                        <Col xs={6} md={3}>
                                            {this.renderIfDistrictFound()}
                                        </Col>
                                    </Row>
                                </Grid>
                            </StepContent>
                        </Step>
                        <Step>
                            <StepLabel>Account Creation</StepLabel>
                            <StepContent><div style={contentStyle}>{this.state.accountMessage}</div></StepContent>
                        </Step>
                    </Stepper>
                    <div style={contentStyle} className={stepIndex === 2 ? 'collapse' : ''}>
                        <div>
                            <div style={{marginTop: 12}}>
                                <FlatButton
                                    label="Back"
                                    disabled={stepIndex === 0 || stepIndex === 2}
                                    onClick={this.handlePrev}
                                    style={{marginRight: 12}}/>
                                <RaisedButton
                                    label={stepIndex === 2 ? 'Return to login' : 'Next'}
                                    primary={true}
                                    onClick={this.handleNext}/>
                            </div>
                        </div>
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default Signup;