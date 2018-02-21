import React, {Component} from 'react';
import {Grid, Col, Row, Modal} from 'react-bootstrap';
import Loader from 'react-loader'
import {
    Step,
    Stepper,
    StepLabel,
    StepContent,
} from 'material-ui/Stepper';
import $ from 'jquery';
import HttpRequest from "../../adapters/httpRequest";
import constants from "../../utils/constants";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker'
import TimePicker from 'material-ui/TimePicker'
import AppBar from 'material-ui/AppBar'
import {blue500} from 'material-ui/styles/colors'
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import ReactTable from 'react-table'
import "react-table/react-table.css";
import matchSorter from 'match-sorter'
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import EventDetail from './EventDetail'




class Events extends Component {
    constructor(props) {
        super(props);
        this.closeModal = this.closeModal.bind(this);
        this.createNewEvent = this.createNewEvent.bind(this);
        this.createEventPost = this.createEventPost.bind(this);
        this.nextStep = this.nextStep.bind(this);
        this.previousStep = this.previousStep.bind(this);
        this.eventDetails = this.eventDetails.bind(this);
        this.showEvents = this.showEvents.bind(this);

        this.state = {
            test: {},
            loading: false,
            modal: false,
            stepIndex: 0,
            //used to send to event detail as a prop
            eventId :'',

            eventName: '',
            eventDate: '',
            startTime: '',
            endTime: '',
            eventLocation:'',
            eventDescription: '',

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
            eventDescription: '',
            //this is a date object
            eventDate: '',
            startTime: '',
            endTime: '',

            renderDetails : false

        })
    }

    closeModal() {
        //reset when closing modal
        this.setState({
            modal: false,
            stepIndex: 0,
            eventName: '',
            eventDate: '',
            startTime: '',
            endTime: ''
        })
    }

    nextStep() {
        //validate event entries here
        var _this = this;
        var missingInfo = false;
        // Checks first name
        if (this.state.eventName.length < 1) {
            missingInfo = true;
            this.setState({
                eventName: this.state.eventName.trim(),
                eventNameError: "Event name is required"
            })
        } else {
            this.setState({
                eventNameError: undefined
            })
        }
        if (this.state.eventDate.length < 1) {
            missingInfo = true;
            this.setState({
                eventDateError: "Event date is required"
            })
        } else {
            this.setState({
                eventDateError: undefined
            })
        }
        if (this.state.startTime.length < 1) {
            missingInfo = true;
            this.setState({
                startTimeError: "Event description is required"
            })
        } else {
            this.setState({
                startTimeError: undefined
            })
        }
        if (this.state.endTime.length < 1) {
            missingInfo = true;
            this.setState({
                endTimeError: "Event description is required"
            })
        } else {
            this.setState({
                endTimeError: undefined
            })
        }
        if (this.state.eventLocation.length < 1) {
            missingInfo = true;
            this.setState({
                eventLocationError: "Event description is required"
            })
        } else {
            this.setState({
                eventLocationError: undefined
            })
        }
        if (this.state.eventDescription.length < 1) {
            missingInfo = true;
            this.setState({
                eventDescriptionError: "Event description is required"
            })
        } else {
            this.setState({
                eventDescriptionError: undefined
            })
        }

        if (!missingInfo) {
            const {eventName, stepIndex} = this.state;
            _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + "/sweng500/verifyEvent/" + eventName, "get", constants.useCredentials(), null).then(function (result) {
                console.log("verify event");
                alert(result.status);
                _this.setState({
                    stepIndex: stepIndex + 1
                })

            }).catch(function (error) {
                _this.setState({
                    eventNameError: "Event Name already exists"
                });
                console.log(error);
            })
        }
    }

    previousStep() {
        const {stepIndex} = this.state;
        this.setState({
            stepIndex: stepIndex - 1
        })
    }

    //go to the event page to show all of the information available to edit
    //will need a similar method to go back to event main page..
    eventDetails(id) {
        //alert(id);
        this.setState({
            renderDetails:true,
            eventId:id
        })
        $('#eventDetails').removeClass('collapse');
        $('#eventPage').addClass('collapse');

    }
    //called from the subclass to go back to events
    showEvents(event) {
        event.preventDefault();
        this.setState({
            renderDetails:false
        })
        $('#eventDetails').addClass('collapse');
        $('#eventPage').removeClass('collapse')
    }

    removeEvent(eventId) {
        alert("Removing " + eventId);
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

    renderIfEventsFound() {

        if (this.state.test !== null && Object.keys(this.state.test).length !== 0) {
            const columns = [{
                Header: 'Event Name',
                filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, {keys: ["name"]}),
                filterAll: true,
                accessor: 'name' // String-based value accessors!
            }, {
                Header: 'Event Description',
                filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, {keys: ["description"]}),
                filterAll: true,
                accessor: 'description' // String-based value accessors!
            }, {
                Header: 'Actions',
                accessor: 'menuActions', // String-based value accessors!
                style: {textAlign: 'center'},
                sortable: false,
                filterable: false
            }];
            for (let value in this.state.test) {
                this.state.test[value].menuActions = <div><RaisedButton
                    primary={true} label="View Details"
                    onClick={(event) => this.eventDetails(this.state.test[value].id)}/>&nbsp;&nbsp;&nbsp;<RaisedButton
                    secondary={true} label="Delete"
                    onClick={(event) => this.eventDetails(this.state.test[value].id)}/></div>;
            }
            return (
                <ReactTable
                    data={this.state.test}
                    filterable
                    defaultFilterMethod={(filter, row) =>
                        String(row[filter.id]) === filter.value}
                    columns={columns}
                    defaultPageSize={10}
                    className="-striped -highlight"
                    defaultSorted={[{id: "name"}]}
                />
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
            actionButton =
                <RaisedButton icon={<FontIcon className="pe-7s-angle-down-circle"/>} primary={true} label="Judges"
                              onClick={this.nextStep}/>;
        } else {
            backButton =
                <RaisedButton icon={<FontIcon className="pe-7s-angle-up-circle"/>} primary={true} label="Back to Info"
                              onClick={this.previousStep}/>;
            actionButton = <RaisedButton icon={<FontIcon className="pe-7s-like2"/>} primary={true} label="Create Event"
                                         onClick={this.createEventPost}/>;
        }
        if(this.state.renderDetails){
            return (
            <EventDetail showEvents={this.showEvents} eventId={this.state.eventId}/>
            )
        }
        return (

            <div className="content">

                <div id='eventPage' key="notFound-key" className="notFoundClass">
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

                                    {this.renderIfEventsFound()}
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
                                                        errorText={this.state.eventNameError}
                                                        onChange={(event, newValue) => this.setState({eventName: newValue})}
                                                        value={this.state.eventName}
                                                        required={true}
                                                        autoFocus={true}
                                                        fullWidth={true}
                                                    />
                                                </Col>
                                                <Col md={2} mdOffset={1} xs={2}>
                                                    <DatePicker
                                                        errorText={this.state.eventDateError}
                                                        onChange={(event, newValue) => this.setState({eventDate: newValue})}
                                                        value={this.state.eventDate}
                                                        hintText="Event Date"
                                                        floatingLabelText="Event Date"
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
                                                        errorText={this.state.startTimeError}
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
                                                        errorText={this.state.endTimeError}
                                                        floatingLabelText="End Time"
                                                        onChange={(event, newValue) => this.setState({endTime: newValue})}
                                                        value={this.state.endTime}
                                                        hintText="End time"
                                                        textFieldStyle={styles.formFields}
                                                        autoOk={true}
                                                    />
                                                </Col>
                                            </Row>
                                            <Row className={"show-grid"}>
                                                <Col md={5}>
                                                    <SelectField
                                                        floatingLabelText="Event Location"
                                                        value={this.state.eventLocation}
                                                        onChange={(event, newValue) => this.setState({eventLocation: newValue})}
                                                        autoWidth={true}
                                                    >
                                                        <MenuItem value={5} primaryText="Testing" />
                                                    </SelectField>

                                                </Col>

                                            </Row>
                                            <Row className={"show-grid"}>
                                                <Col md={5}>
                                                    <TextField
                                                        id={"eventDescription"}
                                                        floatingLabelText="Event Description"
                                                        errorText={this.state.eventDescriptionError}
                                                        onChange={(event, newValue) => this.setState({eventDescription: newValue})}
                                                        value={this.state.eventDescription}
                                                        required={true}
                                                        fullWidth={true}
                                                        multiLine={true}
                                                        rows={3}
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
