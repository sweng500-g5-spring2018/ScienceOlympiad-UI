import React, {Component} from 'react';
import {MuiThemeProvider, AppBar, TextField} from 'material-ui';
import Button from '../../elements/CustomButton/CustomButton';
import {Grid, Row, Col, Panel} from 'react-bootstrap';

import ReactTable from 'react-table';
import SchoolSelector from "../../components/Schools/SchoolSelector";

class StudentAdder extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedSchool: undefined
        }
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
                                    // errorText={this.state.firstNameRequired}
                                    floatingLabelText="First name"
                                    onChange={(event, newValue) => this.setState({firstName: newValue})}
                                    // value={this.state.firstName}
                                    fullWidth={true}
                                    required={true}/>
                            </Col>
                            <Col xs={7} md={3}>
                                <TextField
                                    name="lname"
                                    hintText="Student's Last Name"
                                    // errorText={this.state.lastNameRequired}
                                    floatingLabelText="Last name"
                                    onChange={(event, newValue) => this.setState({lastName: newValue})}
                                    // value={this.state.lastName}
                                    fullWidth={true}
                                    required={true}/>
                            </Col>
                        </Row>
                        <Row className="show-grid">
                            <Col xs={7} md={3}>
                                <TextField
                                    name="email"
                                    hintText="Student's Email Address"
                                    // errorText={this.state.emailAddressRequired}
                                    floatingLabelText="Email address"
                                    onChange={(event, newValue) => this.setState({emailAddress: newValue})}
                                    // value={this.state.emailAddress}
                                    fullWidth={true}
                                    required={true}/>
                            </Col>
                        </Row>
                        <Row className="show-grid">
                            <Col xs={7} md={3}>
                                <SchoolSelector hintText={"Select School"} selected={this.state.selectedSchool} callBack={ (x,y, value) => {this.setState({selectedSchool: value})}}/>
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

export default StudentAdder;