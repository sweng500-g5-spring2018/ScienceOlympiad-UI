import React, {Component} from 'react';
import {MuiThemeProvider, AppBar, TextField, RaisedButton, FontIcon} from 'material-ui';
import {Grid, Row, Col} from 'react-bootstrap';

import CustomDropdown from "../../elements/CustomSelector/CustomDropdown";
import constants from "../../utils/constants";
import Validator from "../../utils/validator";
import HttpRequest from "../../adapters/httpRequest";

class StudentAdder extends Component {
    constructor(props) {
        super(props);

        this.state = {
            firstName: "",
            lastName: "",
            emailAddress: "",
            selectedSchool: undefined,
            errors: {}
        }

        this.selectedSchool = this.selectedSchool.bind(this);
        this.validateStudentForm = this.validateStudentForm.bind(this);
    }

    selectedSchool(value) {
        this.setState({
            selectedSchool: value
        })
    }

    addStudent() {
        var body = {};
        body.firstName = this.state.firstName;
        body.lastName = this.state.lastName;
        body.emailAddress = this.state.emailAddress;

        var _this = this;

        _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + '/sweng500/addUser/?userType=STUDENT&schoolID=' + _this.state.selectedSchool.id, 'POST', constants.useCredentials(), body, true).then(function (result) {
            _this.setState({
                firstName: "",
                lastName: "",
                emailAddress: "",
                selectedSchool: undefined
            }, () => {
                _this.props.addNotification(<div><b>{body.firstName + ' ' + body.lastName}</b> has been created.</div>, 'success');
                _this.props.updateTable();
            });

            // alert(result.body);
        }).catch(function (error) {
            _this.props.addNotification(<div><b>{body.firstName}</b> could not be created because: <em>{error.message}</em></div>, 'error');
        });
    }

    validateStudentForm() {
        var errors = {};

        if(this.state.firstName.trim() === "") {
            errors.firstNameError = "First name is required";
        }
        if(this.state.lastName.trim() === "") {
            errors.lastNameError = "Last name is required";
        }

        let result = Validator.validateEmail(this.state.emailAddress);

        if(!result.isValid) {
            errors.emailAddressError = result.message;
        }

        if( !this.state.selectedSchool ){
            errors.schoolError = "School is required"
        }

        this.setState({errors: errors}, () => {
            if(constants.isEmpty(this.state.errors)) {
                this.addStudent();
            }
        });
    }

    render() {
        return (
            <MuiThemeProvider>
                <div style={{textAlign: 'center'}}>
                    <AppBar showMenuIconButton={false} title="Register Student" style={{zIndex: 10}}/>
                    <Grid>
                        <Row className="text-center" >
                            <Col xs={7} md={3}>
                                <TextField
                                    name="fname"
                                    hintText="Student's First Name"
                                    errorText={this.state.errors.firstNameError}
                                    floatingLabelText="First name"
                                    onChange={(event, newValue) => this.setState({firstName: newValue.trim()})}
                                    value={this.state.firstName}
                                    fullWidth={true}
                                    required={true}
                                    style={{textAlign: 'left'}}
                                />
                            </Col>
                            <Col xs={7} md={3}>
                                <TextField
                                    name="lname"
                                    hintText="Student's Last Name"
                                    errorText={this.state.errors.lastNameError}
                                    floatingLabelText="Last name"
                                    onChange={(event, newValue) => this.setState({lastName: newValue.trim()})}
                                    value={this.state.lastName}
                                    fullWidth={true}
                                    required={true}
                                    style={{textAlign: 'left'}}
                                />
                            </Col>
                        </Row>
                        <Row className="show-grid">
                            <Col xs={7} md={3}>
                                <TextField
                                    name="email"
                                    hintText="Student's Email Address"
                                    errorText={this.state.errors.emailAddressError}
                                    floatingLabelText="Email address"
                                    onChange={(event, newValue) => this.setState({emailAddress: newValue.trim()})}
                                    value={this.state.emailAddress}
                                    fullWidth={true}
                                    required={true}
                                    style={{textAlign: 'left'}}
                                />
                            </Col>
                            <Col xs={7} md={3}>
                                <CustomDropdown
                                    textAlign={"left"}
                                    name={"school"}
                                    labelText={"School"}
                                    hintText={"Select School"}
                                    errorText={this.state.errors.schoolError}
                                    selected={this.state.selectedSchool}
                                    endpoint={"/sweng500/getSchools"}
                                    sortKey={"schoolName"}
                                    textKeys={["schoolName"]}
                                    selectedValue={this.selectedSchool}
                                />
                            </Col>
                        </Row>
                        <Row className="center-block">
                            <Col sm={6} smOffset={1} style={{maxWidth: 200}}>
                                <RaisedButton icon={<FontIcon className="pe-7s-close-circle" />} label="Cancel" onClick={event => {this.props.togglePanel("")} } />
                            </Col>
                            <Col sm={6}  style={{maxWidth: 200}}>
                                <RaisedButton icon={<FontIcon className="pe-7s-like2" />} primary={true} onClick={this.validateStudentForm} label="Confirm"/>
                            </Col>
                        </Row>
                    </Grid>
                </div>
            </MuiThemeProvider>
        )
    }

}

export default StudentAdder;