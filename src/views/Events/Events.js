import React, {Component} from 'react';
import {PageHeader,Well,Alert, Grid, Col, Row, Modal} from 'react-bootstrap';
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
import Dialog from 'material-ui/Dialog';
import EventDetail from './EventDetail'
import FormInputs from "../../components/FormInputs/FormInputs";
import NotificationSystem from 'react-notification-system';
import {style} from "../../variables/Variables";
import BuildingSelector from "../../components/Buildings/BuildingSelector";
import * as Promises from "axios";

class Events extends Component {
    constructor(props) {
        super(props);
        this.closeModal = this.closeModal.bind(this);
        this.createNewEvent = this.createNewEvent.bind(this);
        this.createEventPost = this.createEventPost.bind(this);
        this.removeEvent = this.removeEvent.bind(this);
        this.nextStep = this.nextStep.bind(this);
        this.previousStep = this.previousStep.bind(this);
        this.eventDetails = this.eventDetails.bind(this);
        this.showEvents = this.showEvents.bind(this);
        this.addJudgeInputs = this.addJudgeInputs.bind(this);
        this.removeNewJudge = this.removeNewJudge.bind(this);
        this.addNotification = this.addNotification.bind(this);
        this.buildingCallback = this.buildingCallback.bind(this);

        this.state = {
            events: {},
            loading: false,
            modal: false,
            confirmDialog: false,
            confirmMessage: '',
            deleteID: '',
            stepIndex: 0,
            //used to send to event detail as a prop
            eventId: '',

            eventName: '',
            eventDate: '',
            startTime: '',
            endTime: '',
            eventLocation: '',
            eventDescription: '',
            //for adding judges
            judgeInputs: [],
            //keep track of the actual new Judges
            judgeCount: 0,
            //hold the existing judges
            existingJudgeValues: [],
            existingJudgeEmails: [],
            _notificationSystem: null


        };
    }


    buildingCallback(event, index, value) {

        this.setState({eventLocation: value});
    }

    addNotification(message, level, position, autoDismiss, optionalTitle) {
        this.state._notificationSystem.addNotification({
            title: optionalTitle ? optionalTitle : (<span data-notify="icon" className="pe-7s-note2"></span>),
            message: (
                <div>
                    {message}
                </div>
            ),
            level: level ? level : 'info',
            position: position ? position : 'tc',
            autoDismiss: autoDismiss ? autoDismiss : 10,
        });
    }

    //launch the modal to enter an event
    createNewEvent() {
        this.setState({
            modal: true
        })
    }

    createEventPost() {
        var _this = this;
        var body = {};
        var newJudges = {};
        var gatherjudges = {};
        var newJudgeList = [];
        var i;
        var errorFound = false;
        for (i = 1; i <= this.state.judgeCount; i++) {
            var tempFname = "#judgefname" + i;
            var tempLname = "#judgelname" + i;
            var tempEmail = "#judgemail" + i;
            // alert($(tempFname).val() + "     " + $(tempLname).val() +  "     " + $(tempEmail).val());
            gatherjudges.fname = $(tempFname).val();
            gatherjudges.lname = $(tempLname).val();
            gatherjudges.email = $(tempEmail).val();

            newJudgeList.push(gatherjudges);
            gatherjudges = {};


        }
        // newJudges.newjudges= newJudgeList;
       // alert(newJudgeList);
        if (!errorFound) {
            var event = {};

            event.name = this.state.eventName;
            event.description = this.state.eventDescription;
            event.eventDate = this.state.eventDate;
            event.building = this.state.eventLocation;
            event.startTime = this.state.startTime;
            event.endTime = this.state.endTime;
            //the actual string
            body.eventJson = event;
            //exiting judge values has an extra pair of quotes around each item in the list...
            body.existingJudgeValues = this.state.existingJudgeValues;
            body.newJudgeValues = newJudgeList;
            console.log(JSON.stringify(body));
            _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + "/sweng500/addEvent/", "POST", constants.useCredentials(), body, true).then(function (result) {
                _this.addNotification(
                    "Success: The event has been added.",
                    "success",
                    "tc",
                    6
                );
                _this.componentDidMount();

            }).catch(function (error) {
                _this.addNotification(
                    "Error: There was a problem creating the event.",
                    "error",
                    "tc",
                    6
                );
                _this.componentDidMount();
            })
            //show some success and then clear the fields
            //refresh after an add to show new event in table
            this.setState({
                modal: false,
                stepIndex: 0,

                eventName: '',
                eventDescription: '',
                //this is a date object
                eventDate: '',
                startTime: '',
                endTime: '',
                eventLocation: '',
                judgeInputs: [],
                judgeCount: 0,
                existingJudgeValues: [],
                existingJudgeEmails: [],
                renderDetails: false,

            })
        } else {
            alert("some error was found when adding new judges");
        }

    }

    closeModal() {
        //reset when closing modal
        this.setState({
            modal: false,
            stepIndex: 0,
            eventName: '',
            eventDate: '',
            startTime: '',
            endTime: '',
            eventDescription: '',
            eventLocation: '',
            judgeInputs: [],
            judgeCount: 0,

        })
    }

    // Checks to see if an email has a host, @ symbols, and domain.
    validEmail(text) {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(text) === false)
            return true;
        else
            return false;
    }

    nextStep() {
        //validate event entries here

        var _this = this;
        var missingInfo = false;
        const {eventName, stepIndex} = this.state;
        // Checks first name
        if (stepIndex == 0) {
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
                    eventLocationError: "Please select a building for the event"
                })
            }
            else {
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

                _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + "/sweng500/verifyEvent/" + eventName, "get", constants.useCredentials(), null, true).then(function (result) {
                    console.log("verify event");
                    // alert(result.status);
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
        } else if (stepIndex == 1) {
            //no validation since we are just pulling judges from the db
            _this.setState({
                stepIndex: stepIndex + 1
            })
        } else {
                //only verify the last email and send to create event post

            var validateFields = true;
            let judgeCnt = _this.state.judgeCount;
            let idname = "#judgemail"+judgeCnt;
            var promises =[];
            //do not run when displaying the first set of inputs
            if(judgeCnt > 0) {
                var email = $(idname).val();
                var body = {};
                if (email != null && email.length > 0) {
                    if(!this.validEmail(email.trim())) {
                        body.emailAddress = email;
                        promises.push(_this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + '/sweng500/emailAvailable', 'POST', null, body));
                        console.log("added a promise " + email);
                    } else {
                        $(idname).parent().parent().parent().parent().find(".errorText").text("Email is not in the correct format");
                        $(idname).parent().parent().parent().parent().find(".errorText").css("display","block");
                    }
                } else {
                    $(idname).parent().parent().parent().parent().find(".errorText").text("Email is required");
                    $(idname).parent().parent().parent().parent().find(".errorText").css("display","block");
                }
            }
            //only continue to create event if this email is good
            if (promises.length > 0) {
                Promises.all(promises).then(function (results) {
                    $(idname).attr("disabled", true);
                    $(idname).parent().parent().parent().parent().find(".errorText").text("");
                    $(idname).parent().parent().parent().parent().find(".errorText").css("display", "none");
                    //finally send the event request
                    _this.createEventPost();

                }).catch(function (error) {
                    $(idname).parent().parent().parent().parent().find(".errorText").text("Email is already in use");
                    $(idname).parent().parent().parent().parent().find(".errorText").css("display","block");
                })
            } else {
                //just create event if no new judges
                _this.createEventPost();
            }
        }
    }

    //go back a step while creating event
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
            renderDetails: true,
            eventId: id
        })
        $('#eventDetails').removeClass('collapse');
        $('#eventPage').addClass('collapse');

    }

    //called from the subclass to go back to events
    showEvents(event) {
        event.preventDefault();
        this.setState({
            renderDetails: false
        })
        $('#eventDetails').addClass('collapse');
        $('#eventPage').removeClass('collapse')
    }

    removeEvent() {
        var _this = this;
        var removeId = _this.state.deleteID;
        //just making remove a post for now
        _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + "/sweng500/removeEvent/" + removeId, "DELETE", constants.useCredentials(), null, true).then(function (result) {
            _this.setState({confirmDialog: false});
            _this.addNotification(
                "Success: The event has been deleted.",
                "info",
                "tc",
                6
            );
            _this.componentDidMount();
        }).catch(function (error) {
            _this.setState({confirmDialog: false});
            _this.addNotification(
                "Error: The event has not been deleted.",
                "error",
                "tc",
                6
            );
            _this.componentDidMount();
            console.log(error);
        })
        _this.setState({confirmDialog: false});


    }

    //dynamically add in new input fields when clicked, validate the previous entry first
    addJudgeInputs() {
        //get a local copy so we dont set state here and re-render, update state after

        var _this = this;
        //control whether we execute the promise based on validation
        var validateFields = true;

        let judgeCnt = _this.state.judgeCount;
        let idname = "#judgemail"+judgeCnt;
        var promises =[];
        //do not run when displaying the first set of inputs
        if(judgeCnt > 0) {
            var email = $(idname).val();
            var body = {};
            if (email != null && email.length > 0) {
                if(!this.validEmail(email.trim())) {
                    body.emailAddress = email;
                    promises.push(_this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + '/sweng500/emailAvailable', 'POST', null, body));
                    console.log("added a promise " + email);
                } else {
                    //not the prettiest code....
                    $(idname).parent().parent().parent().parent().find(".errorText").text("Email is not in the correct format");
                    $(idname).parent().parent().parent().parent().find(".errorText").css("display","block");
                    validateFields = false;
                }
            } else {
                $(idname).parent().parent().parent().parent().find(".errorText").text("Email is required");
                $(idname).parent().parent().parent().parent().find(".errorText").css("display","block");
                validateFields = false;
            }
        }
        if(validateFields) {
            judgeCnt = judgeCnt + 1;

            const fnameJudge = [
                <TextField
                    id={"judgefname" + judgeCnt}
                    floatingLabelText="First Name"
                    required={true}
                    autoFocus={true}
                    fullWidth={true}
                />];
            const lnameJudge = [
                <TextField
                    id={"judgelname" + judgeCnt}
                    floatingLabelText="Last Name"
                    required={true}
                    fullWidth={true}
                />];
            const emailJudge = [
                <TextField
                    id={"judgemail" + judgeCnt}
                    floatingLabelText="Email"
                    required={true}
                    fullWidth={true}
                />];

            //only add thew new row if the previous email is valid or
            // alert(promises.length +   "  judcnt  " + judgeCnt);
            if (promises.length > 0) {
                Promises.all(promises).then(function (results) {
                    $(idname).attr("disabled", true);
                    $(idname).parent().parent().parent().parent().find(".errorText").text("");
                    $(idname).parent().parent().parent().parent().find(".errorText").css("display","none");

                    console.log("success email");
                    _this.setState({
                        judgeCount: _this.state.judgeCount + 1,

                        //add judges class to use jquery to loop over reach one
                        judgeInputs: _this.state.judgeInputs.concat(<Row>
                            <div className={"col-md-9 col-xs-7" + " row" + judgeCnt}><Well>
                                <h3>New Judge {judgeCnt}</h3>
                                <Row><Alert style={{display:"none"}} bsStyle="danger"
                                            className="errorText"></Alert></Row>
                                <Row><Col md={4} xs={7}>{fnameJudge}</Col></Row>
                                <Row><Col md={4} xs={7}>{lnameJudge}</Col></Row>
                                <Row><Col md={4} xs={7}>{emailJudge}</Col></Row></Well>
                            </div>
                        </Row>)
                    });
                }).catch(function (error) {
                    //ugly way to add error text

                    console.log("error in email --- " + idname);
                    $(idname).attr("disabled", false);
                    $(idname).parent().parent().parent().parent().find(".errorText").text("Email already exists");
                    $(idname).parent().parent().parent().parent().find(".errorText").css("display","block");

                });
            } else {
                _this.setState({
                    judgeCount: _this.state.judgeCount + 1,
                    //add judges class to use jquery to loop over reach one
                    judgeInputs: _this.state.judgeInputs.concat(<Row>
                        <div className={"col-md-9 col-xs-7" + " row" + judgeCnt}><Well>
                            <h3>New Judge {judgeCnt}</h3>
                            <Row> <Alert style={{display:"none"}} className="errorText" bsStyle="danger"></Alert></Row><Row>
                            <Col md={4} xs={7}>{fnameJudge}</Col></Row>
                            <Row><Col md={4} xs={7}>{lnameJudge}</Col></Row>
                            <Row><Col md={4} xs={7}>{emailJudge}</Col></Row></Well>
                        </div>
                    </Row>)
                });
            }
        }

    }

    //Remove the text fields for the most recent judge
    removeNewJudge = (judgeCount) =>{
        //alert("judge count" + judgeCount);
        var _this =this;
        var tempCount = _this.state.judgeCount;
        var domId = ".row"+ tempCount;
        $(domId).remove();
        tempCount -= 1;
        domId=".row" +tempCount;
        //reenable the previous row
        $(domId).find("#judgemail"+tempCount).attr("disabled", false);
        //always decrement when we remove
        _this.setState({
            judgeCount: this.state.judgeCount -1,
        })


    }

    // Delete the event
    confirmEventDelete = (s) => {
        // alert("Got here");
        this.setState({deleteID: s.id});
        this.setState({confirmMessage: "Are you sure you want to delete : " + s.name + " ?", confirmDialog: true});
    }

    closeConfirmDialog = () => {
        this.setState({confirmDialog: false});
    }

    componentDidMount() {
        //Make call out to backend
        var _this = this;
        this.setState({_notificationSystem: this.refs.notificationSystem});

        _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + "/sweng500/events", "get", constants.useCredentials(), null, true).then(function (result) {
            _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + "/sweng500/getJudges", "get", constants.useCredentials(), null, true).then(function (judgeResult) {
                console.log(result.body);
                _this.setState({
                    events: result.body,

                    existingJudgeEmails: judgeResult.body,
                    loading: true
                })

            }).catch(function (error) {
                console.log(error);
            })

        }).catch(function (error) {
            console.log(error);
        })

    }

    renderIfEventsFound() {

        if (this.state.events !== null && Object.keys(this.state.events).length !== 0) {
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
            for (let value in this.state.events) {
                this.state.events[value].menuActions = <div><RaisedButton
                    primary={true} label="View Details"
                    onClick={(event) => this.eventDetails(this.state.events[value].id)}/>&nbsp;&nbsp;&nbsp;<RaisedButton
                    secondary={true} label="Delete"
                    onClick={this.confirmEventDelete.bind(this, this.state.events[value])}/></div>;
            }
            return (
                <ReactTable
                    data={this.state.events}
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
                              onClick={this.nextStep}
                />;
        } else if (this.state.stepIndex == 1) {
            backButton =
                <RaisedButton icon={<FontIcon className="pe-7s-angle-up-circle"/>} primary={true} label="Back to Info"
                              onClick={this.previousStep}/>;
            actionButton = <RaisedButton icon={<FontIcon className="pe-7s-angle-down-circle"/>} primary={true}
                                         label="Add new judges"
                                         onClick={this.nextStep}/>;

        } else {
            backButton =
                <RaisedButton icon={<FontIcon className="pe-7s-angle-up-circle"/>} primary={true}
                              label="Back to Existing"
                              onClick={this.previousStep}/>;
            actionButton = <RaisedButton icon={<FontIcon className="pe-7s-like2"/>} primary={true} label="Create Event"
                                         onClick={this.nextStep}/>;
        }
        if (this.state.renderDetails) {
            return (
                <EventDetail showEvents={this.showEvents} eventId={this.state.eventId}/>
            )
        }

        const deleteActions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onClick={this.closeConfirmDialog}
            />,
            <FlatButton
                label="Delete"
                primary={true}
                onClick={this.removeEvent}
            />,
        ];
        return (

            <div className="content">
                <NotificationSystem ref="notificationSystem" style={style}/>
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
                    <Modal bsSize="large" show={this.state.modal} onHide={this.closeModal}>
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
                                                <Col md={3} mdOffset={1} xs={7}>
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
                                                <Col md={3} mdOffset={1} xs={7}>
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
                                                <Col md={3} mdOffset={1} xs={7}>
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
                                                <Col md={3} mdOffset={1} xs={7}>
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
                                            <Row className="show-grid">
                                                <Col xs={5} mdOffset={1} xs={7}>
                                                    <BuildingSelector selected={this.state.eventLocation}
                                                                      errorMsg={this.state.eventLocationError}
                                                                      callBack={this.buildingCallback}
                                                                      labelText={"Building"}
                                                                      hintText={"Select a building"}/>
                                                </Col>
                                            </Row>
                                            <Row className={"show-grid"}>
                                                <Col md={5} mdOffset={1} xs={7}>
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
                                        <StepLabel>Assign Existing Judges</StepLabel>
                                        <StepContent>
                                            <Row>
                                                <Col md={7} xs={5}>
                                                    <Alert bsStyle="info">
                                                        Select an existing judge or move to next step to
                                                        create new judges
                                                    </Alert>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={7} xs={5}>
                                                    <SelectField
                                                        multiple={true}
                                                        fullWidth={true}
                                                        autoWidth={true}
                                                        hintText="Existing judges"
                                                        value={this.state.existingJudgeValues}
                                                        onChange={this.judgeMenuClick}
                                                    >
                                                        {this.judgeMenuItems(this.state.existingJudgeValues)}
                                                    </SelectField>
                                                </Col>
                                            </Row>
                                        </StepContent>
                                    </Step>
                                    <Step>
                                        <StepLabel>Create New Judges</StepLabel>
                                        <StepContent>

                                            {this.state.judgeInputs}
                                            <Row>
                                                <Col md={3}>
                                            <RaisedButton icon={<FontIcon className="pe-7s-angle-down-circle"/>}
                                                          primary={true} label="Add new judge"
                                                          onClick={this.addJudgeInputs}/>
                                                </Col>
                                                <Col md={3}>
                                                    <RaisedButton icon={<FontIcon className="pe-7s-close"/>}
                                                                  secondary={true} label="Remove judge"
                                                                  onClick={this.removeNewJudge.bind(this)}/>
                                                </Col>

                                            </Row>
                                        </StepContent>
                                    </Step>
                                </Stepper>
                            </Grid>
                        </Modal.Body>

                        <Modal.Footer>
                            {backButton} {actionButton}
                        </Modal.Footer>
                    </Modal>
                    <Dialog
                        actions={deleteActions}
                        modal={false}
                        open={this.state.confirmDialog}
                        onRequestClose={this.closeConfirmDialog}
                    >
                        {this.state.confirmMessage}
                    </Dialog>

                </MuiThemeProvider>
            </div>
        );
    }

    //adds in the menu items for existing judges
    judgeMenuItems = (existingJudgeValues) => {
        if (this.state.existingJudgeEmails != null) {
            return this.state.existingJudgeEmails.map((obj) => (
                <MenuItem
                    key={obj.id}
                    insetChildren={true}
                    targetOrigin={{horizontal: "right", vertical: "bottom"}}
                    checked={existingJudgeValues && existingJudgeValues.indexOf(obj.id) > -1}
                    value={obj.id}
                    primaryText={obj.firstName + "     " + obj.lastName + "  --   " + obj.emailAddress}
                />
            ));
        }
    }

    //allows the check mark to be applied next to the selections
    judgeMenuClick = (event, index, values) => {
        this.setState({existingJudgeValues: values});
    }
}

export default Events;
