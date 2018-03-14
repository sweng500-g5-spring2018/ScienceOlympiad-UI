import React, {Component} from 'react';
import {MuiThemeProvider, AppBar, TextField} from 'material-ui';
import Button from '../../elements/CustomButton/CustomButton';
import {Grid, Row, Col, Panel} from 'react-bootstrap';

import ReactTable from 'react-table';
import SchoolSelector from "../../components/Schools/SchoolSelector";
import CoachSelector from "./CoachSelector";

class TeamAdder extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedSchool: undefined,
            selectedCoach: undefined,
            unallocatedStudents: [],
            coach: undefined
        }
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
                                    // errorText={this.state.firstNameRequired}
                                    floatingLabelText="First name"
                                    onChange={(event, newValue) => this.setState({teamName: newValue})}
                                    // value={this.state.firstName}
                                    fullWidth={true}
                                    required={true}/>
                            </Col>
                        </Row>
                        <Row className="show-grid">
                            <Col xs={7} md={3}>
                                <SchoolSelector hintText={"Select School"} selected={this.state.selectedSchool} callBack={ (x,y, value) => {this.setState({selectedSchool: value})}}/>
                            </Col>
                            <Col xs={7} md={3}>
                                <CoachSelector hintText={"Select Coach"} selected={this.state.selectedSchool} callBack={ (x,y, value) => {this.setState({selectedSchool: value})}}/>
                            </Col>
                        </Row>
                        <Row className="show-grid">
                            <Col sm={6} style={{maxWidth: 200}}>
                                <Button fill block bsStyle="info" >Confirm</Button>
                            </Col>
                            <Col sm={6} style={{maxWidth: 200}}>
                                <Button fill block bsStyle="danger" >Cancel</Button>
                            </Col>
                        </Row>
                    </Grid>
                </div>
            </MuiThemeProvider>
        )
    }

}

export default TeamAdder;