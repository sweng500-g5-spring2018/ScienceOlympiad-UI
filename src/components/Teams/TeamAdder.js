import React, {Component} from 'react';
import {MuiThemeProvider, AppBar, TextField, RaisedButton, FontIcon} from 'material-ui';
import {Grid, Row, Col} from 'react-bootstrap';

import CustomDropdown from "../../elements/CustomSelector/CustomDropdown";
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

        var _this = this;

        _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + '/sweng500/addTeam/', 'POST', constants.useCredentials(), body, true).then(function (result) {
            _this.setState({
                selectedSchool: undefined,
                selectedCoach: undefined,
                teamName: ""
            }, () => {
                _this.props.addNotification(<div><b>{body.name}</b> has been created.</div>, 'success');
                _this.props.updateTable()
            });

        }).catch(function (error) {
            _this.props.addNotification(<div><b>{body.name}</b> could not be created because: <em>{error.message}</em></div>, 'error');
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
                    <AppBar showMenuIconButton={false} title="Register Team" style={{zIndex: 10}}/>
                    <Grid>
                        <Row className="text-center">
                            <Col xs={14} md={6}>
                                <TextField
                                    name="tname"
                                    hintText="Team's Name"
                                    errorText={this.state.errors.teamNameError}
                                    floatingLabelText="Team Name"
                                    onChange={(event, newValue) => this.setState({teamName: newValue})}
                                    value={this.state.teamName}
                                    fullWidth={true}
                                    required={true}
                                    style={{margin: '1px', textAlign: 'left'}}
                                />
                            </Col>
                            <Col xs={7} md={3}></Col>
                        </Row>
                        <Row className="show-grid">
                            <Col xs={7} md={3}>
                                <CustomDropdown
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
                            <Col xs={7} md={3}>
                                <CustomDropdown
                                    name={"coach"}
                                    labelText={"Coach"}
                                    hintText={"Select Coach"}
                                    errorText={this.state.errors.coachError}
                                    selected={this.state.selectedCoach}
                                    endpoint={"/sweng500/getCoaches"}
                                    sortKey={"lastName"}
                                    textKeys={["firstName","lastName"]}
                                    selectedValue={this.selectedCoach}
                                />
                            </Col>
                        </Row>
                        <Row className="center-block">
                            <Col sm={6} smOffset={1} style={{maxWidth: 200}}>
                                <RaisedButton icon={<FontIcon className="pe-7s-close-circle" />} label="Cancel" onClick={event => {this.props.togglePanel("")} } />
                            </Col>
                            <Col sm={6} style={{maxWidth: 200}}>
                                <RaisedButton icon={<FontIcon className="pe-7s-like2" />} primary={true} onClick={this.validateTeamForm} label="Confirm"/>
                            </Col>
                        </Row>
                    </Grid>
                </div>
            </MuiThemeProvider>
        )
    }

}

export default TeamAdder;