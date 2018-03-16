import React, {Component} from 'react';
import {MuiThemeProvider, AppBar, TextField} from 'material-ui';
import Button from '../../elements/CustomButton/CustomButton';
import {Grid, Row, Col, Panel} from 'react-bootstrap';

import ReactTable from 'react-table';

import CustomDropdown from "./CustomDropdown";
import Validator from "../../utils/validator";
import constants from "../../utils/constants";
import HttpRequest from "../../adapters/httpRequest";

class TeamAdder extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedSchool: undefined,
            selectedCoach: undefined,
            teamName: "",
            unallocatedStudents: [],
            errors: {}
        }

        this.selectedCoach = this.selectedCoach.bind(this);
        this.selectedSchool = this.selectedSchool.bind(this);
        this.validateTeamForm = this.validateTeamForm.bind(this);
    }

    selectedCoach(value) {
        this.setState({
            selectedCoach: value
        })
    }

    selectedSchool(value) {
        this.setState({
            selectedSchool: value
        })
    }

    addTeam() {
        var body = {};
        body.name = this.state.teamName;
        body.coach = this.state.selectedCoach;
        body.school = this.state.selectedSchool;

        console.log(this.state.selectedSchool);

        var _this = this;

        _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + '/sweng500/addTeam/', 'POST', constants.useCredentials(), body, true).then(function (result) {
            _this.setState({
                selectedSchool: undefined,
                selectedCoach: undefined,
                teamName: ""
            });

            alert(result.body);

        }).catch(function (error) {
            alert(error.message);
        });
    }

    validateTeamForm() {
        var errors = {};

        let result = Validator.validateTeamName(this.state.teamName);

        if(!result.isValid) {
            errors.teamNameError = result.message;
        }

        if( !this.state.selectedSchool ){
            errors.schoolError = "School is required"
        }

        if( !this.state.selectedCoach ){
            errors.coachError = "Coach is required"
        }

        this.setState({errors: errors}, () => {
            if(constants.isEmpty(this.state.errors)) {
                this.addTeam();
            }
        });
    }

    render() {
        return (
            <MuiThemeProvider>
                <div style={{textAlign: 'center'}}>
                    <AppBar showMenuIconButton={false} title="Register Team"/>
                    <Grid>
                        <Row className="show-grid" style={{textAlign:'center'}}>
                            <Col xs={7} md={3}>
                                <TextField
                                    name="tname"
                                    hintText="Team's Name"
                                    errorText={this.state.errors.teamNameError}
                                    floatingLabelText="Team Name"
                                    onChange={(event, newValue) => this.setState({teamName: newValue})}
                                    value={this.state.teamName}
                                    fullWidth={true}
                                    required={true}/>
                            </Col>
                        </Row>
                        <Row className="show-grid">
                            <Col xs={7} md={3}>
                                <CustomDropdown
                                    name={"school"}
                                    labelText={"School"}
                                    hintText={"Select School"}
                                    selected={this.state.selectedSchool}
                                    endpoint={"/sweng500/getSchools"}
                                    sortKey={"schoolName"}
                                    textKeys={["schoolName"]}
                                    selectedValue={this.selectedSchool}
                                    errorMsg={this.state.errors.schoolError}
                                />
                            </Col>
                            <Col xs={7} md={3}>
                                <CustomDropdown
                                    name={"coach"}
                                    labelText={"Coach"}
                                    hintText={"Select Coach"}
                                    selected={this.state.selectedCoach}
                                    endpoint={"/sweng500/getCoaches"}
                                    sortKey={"lastName"}
                                    textKeys={["firstName","lastName"]}
                                    selectedValue={this.selectedCoach}
                                    errorMsg={this.state.errors.coachError}
                                />
                            </Col>
                        </Row>
                        <Row className="show-grid">
                            <Col sm={6} style={{maxWidth: 200}}>
                                <Button fill block bsStyle="info" onClick={this.validateTeamForm}>Confirm</Button>
                            </Col>
                            <Col sm={6} style={{maxWidth: 200}}>
                                <Button fill block bsStyle="danger" onClick={event => {this.props.togglePanel("")}}>Cancel</Button>
                            </Col>
                        </Row>
                    </Grid>
                </div>
            </MuiThemeProvider>
        )
    }

}

export default TeamAdder;