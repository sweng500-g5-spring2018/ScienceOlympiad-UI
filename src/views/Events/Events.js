import React, {Component} from 'react';
import {Grid, Col, Row, Button, Modal, Table} from 'react-bootstrap';
import Loader from 'react-loader'
import {
    Step,
    Stepper,
    StepLabel,
    StepContent,
} from 'material-ui/Stepper';
import HttpRequest from "../../adapters/httpRequest";
import constants from "../../utils/constants";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import DatePicker from 'material-ui/DatePicker'
import TimePicker from 'material-ui/TimePicker'
import AppBar from 'material-ui/AppBar'
import {blue500} from 'material-ui/styles/colors'

class Events extends Component {
    constructor(props) {
        super(props);
        this.closeModal = this.closeModal.bind(this);
        this.createNewEvent = this.createNewEvent.bind(this);
        this.createEventPost = this.createEventPost.bind(this);

        this.state = {
            test: {},
            loading: false,
            modal: false,
            stepIndex: 0,

            eventName: '',
            //this is a date object
            eventDate: '',
            startTime: '',
            endTime: ''

        };
    }

    //launch the modal to enter an event
    createNewEvent() {
        console.log("got here");
        //alert("create");
        this.setState({
            modal: true
        })
    }

    createEventPost() {
        alert(this.state.eventName + " --- " + this.state.eventDate);
        alert("make ajax call to create the event from the fields");
    }

    closeModal() {
        this.setState({
            modal: false
        })
    }

    componentDidMount() {
        //Make call out to backend
        var _this = this;

        _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + "/sweng500/events", "get", null, null).then(function (result) {
            console.log("execute");
            _this.setState({
                test: result.data,
                loading: true
            })


        }).catch(function (error) {
            console.log(error);
        })

    }

    renderIfTestFound() {

        if (this.state.test !== null && Object.keys(this.state.test).length !== 0) {

            return (

                <div>


                    <Table striped bordered condensed hover>
                        <thead>
                        <tr>
                            <th>Event Name</th>
                            <th>Event Date</th>
                        </tr>
                        </thead>
                        <tbody>


                        {


                            Object.keys(this.state.test).map(function (key) {
                                //if(key === 'name' || key === 'id') {
                                return (
                                    <tr>
                                        <td>{this.state.test[key].name} </td>
                                        <td>TBD</td>
                                    </tr>
                                )
                                // }
                            }, this)

                        }

                        </tbody>
                    </Table>

                </div>
            )
        } else {

            <h1>Not Found</h1>
        }
    }

    render() {
        const styles = {
            formFields: {
                color: blue500,
                textAlign: 'center',
                width: '100%'
            }
        };
        return (

            <div className="content">
                <div key="notFound-key" className="notFoundClass">
                    <MuiThemeProvider>
                        <Grid>
                            <Row>
                                <Col md={4} mdOffset={4}>
                                    <RaisedButton primary={true} label="Create New Event"
                                                  onClick={this.createNewEvent}/>
                                    <br/>
                                </Col>
                            </Row>
                            <Row>
                                <Loader color="#3498db" loaded={this.state.loading}>

                                    {this.renderIfTestFound()}
                                </Loader>
                            </Row>
                        </Grid>
                    </MuiThemeProvider>

                </div>
                <MuiThemeProvider>
                    <Modal show={this.state.modal} onHide={this.closeModal}>
                        <Modal.Header closeButton>
                            <Modal.Title> <AppBar
                                showMenuIconButton={false}
                                title="Create New Event"
                            /></Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <Grid>
                                <Stepper activeStep={this.state.stepIndex} orientation={'vertical'}>
                                    <Step>
                                        <StepLabel>Event Information</StepLabel>
                                        <StepContent>

                                            <Row className="show-grid">
                                                <Col lg={2} md={2} mdOffset={1} xs={2}>
                                                    <TextField
                                                        id={"eventName"}
                                                        floatingLabelText="Event Name"
                                                        onChange={(event, newValue) => this.setState({eventName: newValue})}
                                                        value={this.state.eventName}
                                                        required={true}
                                                        autoFocus={true}
                                                        fullWidth={true}
                                                        inputStyle={styles.formFields}
                                                    />
                                                </Col>
                                            </Row>
                                            <br/>
                                            <Row className="show-grid">
                                                <Col lg={1} md={1} mdOffset={1} xs={4}>
                                                    <DatePicker
                                                        inputStyle={styles.formFields}
                                                        onChange={(event, newValue) => this.setState({eventDate: newValue})}
                                                        value={this.state.eventDate}
                                                        hintText="Event Date"
                                                        hintStyle={styles.formFields}
                                                        textFieldStyle={styles.formFields}

                                                        mode="landscape"/>

                                                </Col>
                                            </Row>
                                            <br/>
                                            <Row className="show-grid">
                                                <Col md={1} xs={3}>
                                                    <TimePicker
                                                        onChange={(event, newValue) => this.setState({startTime: newValue})}
                                                        value={this.state.startTime}
                                                        textFieldStyle={styles.formFields}
                                                        hintText="Start time"
                                                        autoOk={true}
                                                    />
                                                </Col>
                                                <Col md={1} mdOffset={3} xs={3}>
                                                    <TimePicker
                                                        onChange={(event, newValue) => this.setState({endTime: newValue})}
                                                        value={this.state.endTime}
                                                        hintText="End time"
                                                        textFieldStyle={styles.formFields}
                                                        autoOk={true}
                                                    />
                                                </Col>
                                            </Row>

                                        </StepContent>
                                    </Step>
                                    <Step>
                                        <StepLabel>Assign Judges</StepLabel>
                                        <StepContent>
                                            <h1>Hello judge</h1>
                                        </StepContent>
                                    </Step>
                                </Stepper>
                            </Grid>
                        </Modal.Body>

                        <Modal.Footer>
                            <RaisedButton primary={true} label="Create Event"
                                          onClick={this.createEventPost}/>,
                        </Modal.Footer>
                    </Modal>


                </MuiThemeProvider>
            </div>
        );
    }
}

export default Events;
