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
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';


class Events extends Component {
    constructor(props) {
        super(props);
        this.closeModal = this.closeModal.bind(this);
        this.createNewEvent = this.createNewEvent.bind(this);
        this.createEventPost = this.createEventPost.bind(this);
        this.nextStep = this.nextStep.bind(this);
        this.previousStep = this.previousStep.bind(this);

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
        //show some success and then clear the fields
        this.setState({
            modal: false,
            stepIndex: 0,

            eventName: '',
            //this is a date object
            eventDate: '',
            startTime: '',
            endTime: ''

        })
    }

    closeModal() {
        this.setState({
            modal: false
        })
    }

    nextStep() {
        //validate entries here
        const {stepIndex} = this.state;
        this.setState({
            stepIndex: stepIndex + 1
        })
    }

    previousStep() {
        const {stepIndex} = this.state;
        this.setState({
            stepIndex: stepIndex - 1
        })
    }

    componentDidMount() {
        //Make call out to backend
        var _this = this;

        _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + "/sweng500/events", "get", constants.useCredentials(), null).then(function (result) {
            console.log("execute");
            _this.setState({
                test: result.body,
                loading: true
            })


        }).catch(function (error) {
            console.log(error);
        })

    }

    renderIfTestFound() {

        if (this.state.test !== null && Object.keys(this.state.test).length !== 0) {

            return (
                <Col md={12}>
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
                </Col>
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
        let actionButton = null;
        let backButton = null;
        //control which buttons show up in the modal
        if (this.state.stepIndex == 0) {
            actionButton = <RaisedButton icon={<FontIcon className="pe-7s-angle-down-circle" />} primary={true} label="Judges"
                                         onClick={this.nextStep}/>;
        } else {
            backButton = <RaisedButton icon={<FontIcon className="pe-7s-angle-up-circle" />}primary={true} label="Back to Info"
                                       onClick={this.previousStep}/>;
            actionButton = <RaisedButton icon={<FontIcon className="pe-7s-like2" />} primary={true} label="Create Event"
                                         onClick={this.createEventPost}/>;
        }
        return (

            <div className="content">
                <div key="notFound-key" className="notFoundClass">
                    <MuiThemeProvider>
                        <Grid>
                            <Row className="show-grid">
                                <Col md={4} mdOffset={4}>
                                    <RaisedButton primary={true} label="Create New Event"
                                                  onClick={this.createNewEvent}/>
                                    <br/>
                                </Col>
                            </Row>
                            <br/>
                            <br/>
                            <Row className="show-grid">

                                <Loader color="#3498db" loaded={this.state.loading}>

                                    {this.renderIfTestFound()}
                                </Loader>

                            </Row>
                        </Grid>
                    </MuiThemeProvider>

                </div>
                <MuiThemeProvider>
                    <Modal show={this.state.modal} onHide={this.closeModal}>
                        <Modal.Header>
                            <Modal.Title> <AppBar
                                iconElementRight={<FlatButton label="Close"/>}
                                showMenuIconButton={false}
                                onRightIconButtonClick={(event) => this.closeModal()}
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
                                                <Col md={2} xs={2}>
                                                    <TextField
                                                        id={"eventName"}
                                                        floatingLabelText="Event Name"
                                                        onChange={(event, newValue) => this.setState({eventName: newValue})}
                                                        value={this.state.eventName}
                                                        required={true}
                                                        autoFocus={true}
                                                        fullWidth={true}
                                                    />
                                                </Col>
                                                <Col md={2} mdOffset={1} xs={2}>
                                                    <DatePicker
                                                        // inputStyle={styles.formFields}
                                                        onChange={(event, newValue) => this.setState({eventDate: newValue})}
                                                        value={this.state.eventDate}
                                                        hintText="Event Date"
                                                        floatingLabelText="Event Date"
                                                        //hintStyle={styles.formFields}
                                                        textFieldStyle={styles.formFields}

                                                        mode="landscape"/>

                                                </Col>
                                            </Row>
                                            <br/>
                                            <Row className="show-grid">

                                            </Row>
                                            <br/>
                                            <Row className="show-grid">
                                                <Col md={2} xs={3}>
                                                    <TimePicker
                                                        floatingLabelText="Start Time"
                                                        onChange={(event, newValue) => this.setState({startTime: newValue})}
                                                        value={this.state.startTime}
                                                        textFieldStyle={styles.formFields}
                                                        hintText="Start time"
                                                        autoOk={true}
                                                    />
                                                </Col>
                                                <Col md={2} mdOffset={1} xs={3}>
                                                    <TimePicker
                                                        floatingLabelText="End Time"
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
                            {backButton} {actionButton}
                        </Modal.Footer>
                    </Modal>


                </MuiThemeProvider>
            </div>
        );
    }
}

export default Events;
