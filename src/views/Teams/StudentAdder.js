import React, {Component} from 'react';
import {MuiThemeProvider, AppBar, TextField} from 'material-ui';
import Button from '../../elements/CustomButton/CustomButton';
import {Grid, Row, Col, Panel} from 'react-bootstrap';

import ReactTable from 'react-table';
import SchoolSelector from "../../components/Schools/SchoolSelector";
import CustomDropdown from "./CustomDropdown";
import constants from "../../utils/constants";
import Validator from "../../utils/validator";

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
        alert("STUDENT WOULD BE ADDED");
    }

    validateStudentForm() {
        var errors = {};

        if(!this.state.firstName || this.state.firstName.trim() === "") {
            errors.firstNameError = "First name is required";
        }
        if(!this.state.lastName || this.state.lastName.trim() === "") {
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
                    <AppBar showMenuIconButton={false} title="Register Student"/>
                    <Grid>
                        <Row className="show-grid" style={{textAlign:'center'}}>
                            <Col xs={7} md={3}>
                                <TextField
                                    name="fname"
                                    hintText="Student's First Name"
                                    errorText={this.state.errors.firstNameError}
                                    floatingLabelText="First name"
                                    onChange={(event, newValue) => this.setState({firstName: newValue.trim()})}
                                    value={this.state.firstName}
                                    fullWidth={true}
                                    required={true}/>
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
                                    required={true}/>
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
                                    required={true}/>
                            </Col>
                            <Col xs={7} md={3}>
                                <CustomDropdown
                                    textAlign={"left"}
                                    name={"school"}
                                    labelText={"School"}
                                    hintText={"Select School"}
                                    selected={this.state.selectedSchool}
                                    endpoint={"/sweng500/getSchools"}
                                    sortKey={"schoolName"}
                                    textKeys={["schoolName"]}
                                    selectedValue={this.selectedSchool}
                                />
                            </Col>
                        </Row>
                        <Row className="show-grid">
                            <Col sm={6} style={{maxWidth: 200}}>
                                <Button fill block bsStyle="info" onClick={this.validateStudentForm}>Confirm</Button>
                            </Col>
                            <Col sm={6} style={{maxWidth: 200}}>
                                <Button fill block bsStyle="danger" onClick={event => {this.props.togglePanel("")} }>Cancel</Button>
                            </Col>
                        </Row>
                    </Grid>
                </div>
            </MuiThemeProvider>
        )
    }

}

export default StudentAdder;