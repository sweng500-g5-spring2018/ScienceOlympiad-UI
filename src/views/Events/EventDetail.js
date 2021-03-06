import React, {Component} from 'react';
import { Modal, PageHeader, Panel, Grid, Col, Row,} from 'react-bootstrap';
import HttpRequest from "../../adapters/httpRequest";
import constants from "../../utils/constants";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import "react-table/react-table.css";
import {Map, Marker, GoogleApiWrapper} from 'google-maps-react';
import Loader from 'react-loader'
import Card from '../../components/Cards/Card.js';
import Divider from 'material-ui/Divider';
import AppBar from 'material-ui/AppBar'
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import Dialog from 'material-ui/Dialog';



import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import CustomDropdown from "../../elements/CustomSelector/CustomDropdown";
import AuthService from "../../utils/AuthService";


class EventDetail extends Component {
    constructor(props) {
        super(props);
        this.formatTimeString = this.formatTimeString.bind(this);
        this.selectedTeam = this.selectedTeam.bind(this);
        this.closeTeamModal = this.closeTeamModal.bind(this);
        this.removeJudge = this.removeJudge.bind(this);
        this.removeTeam = this.removeTeam.bind(this);
        //for the map
        this.divStyle = {
            height: '300px',
            width: '450px',
            position: 'relative',
            overflow: 'scroll'
        };

        this.state = {
            loading: false,

            //needed so initial backend call will not have blank eventid
            eventId: props.eventId,
            latitude: '',
            longitude: '',
            eventDetail: {},
            eventDate: '',
            startTime: '',
            endTime: '',
            buildingName: '',
            judgesDetail: {},

            //teams
            teamModal: false,
            //custom dropdown returns an object
            selectedTeamValue: null,
            teamSelectorError: '',
            teamsDetail: {},
            loadAddTeam: true,
            //delete
            showDeleteBtn:true,
            deleteTeam:false,
            deleteJudge:false,
            deleteId:'',
            confirmDialog:false,
            confirmMessage:''
        };

    }

    // If there is a latitude and longitude then display it
    addMarker = () => {
        if (this.state.latitude !== undefined)
            return (
                <Marker name={'Current location'} position={{lat: this.state.latitude, lng: this.state.longitude}}/>);
    }

    //This component gets called initially with main events page, need to update when this is called with a no prop
    componentWillReceiveProps(nextProps) {
        var _this = this;
        _this.setState({
            eventId: nextProps.eventId
        });
    }

    componentDidMount() {
        var _this = this;
        //hide things from non admins
        let modifyRoles = ['ADMIN','COACH'];
        //eventually only allow an admin to delete judges and teams
        let deleteRole = ['ADMIN'];
        let allowModify = AuthService.isUserRoleAllowed(modifyRoles);
        let allowDelete = AuthService.isUserRoleAllowed(deleteRole);
            _this.setState({
                showRegisterBtn: allowModify,
                showDeleteBtn:allowDelete
            });


        _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + "/sweng500/event/" + this.state.eventId, "get", constants.useCredentials(), null, true).then(function (result) {
            const start = _this.formatTimeString(new Date(result.body.startTime));
            const endT = _this.formatTimeString(new Date(result.body.endTime));
            const building = result.body.room.buildingID;
            _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + "/sweng500/getBuilding/" + building, "get", constants.useCredentials(), null, true).then(function (buildResult) {

                _this.setState({
                    eventDetail: result.body,
                    latitude: buildResult.body.lat,
                    longitude: buildResult.body.lng,
                    buildingName: buildResult.body.building,
                    eventDate: new Date(result.body.eventDate).toDateString(),
                    startTime: start,
                    endTime: endT,
                    loading: true
                })
            }).catch(function (error) {
            })

        }).catch(function (error) {
        })

        _this.serverRequestJudge = HttpRequest.httpRequest(constants.getServerUrl() + "/sweng500/event/judges/" + _this.state.eventId, "get", constants.useCredentials(), null, true).then(function (judgeResult) {
            _this.setState({
                judgesDetail: judgeResult.body,
            })

        }).catch(function (error) {
        })

        _this.serverRequestJudge = HttpRequest.httpRequest(constants.getServerUrl() + "/sweng500/event/teams/" + _this.state.eventId, "get", constants.useCredentials(), null, true).then(function (teamResult) {
            _this.setState({
                teamsDetail: teamResult.body,
            })

        }).catch(function (error) {
        })
    }

    formatTimeString(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12;
        if(minutes < 10) {
            minutes = '0' + minutes;
        }
        return hours + ":" + minutes + " " + ampm;
    }

    closeTeamModal() {
        this.setState({loadAddTeam: true, teamModal: false, teamSelectorError: ''})
    }

    selectedTeam(value) {
        this.setState({selectedTeamValue: value})
    }

    registerTeam() {

        var _this = this;
        //custom dropdown stores the entire object so just get the idea
        if (_this.state.selectedTeamValue === null) {
            _this.setState({teamSelectorError: 'Please select a team'});
        } else {
            var body = {teamName: _this.state.selectedTeamValue.name, eventName: _this.state.eventDetail.name};

            _this.serverRequestJudge = HttpRequest.httpRequest(constants.getServerUrl() + "/sweng500/event/" + _this.state.eventId + "/" + _this.state.selectedTeamValue.id, "POST", constants.useCredentials(), body, true).then(function (judgeResult) {
                _this.props.addNotification("Success, the team has been registered ", "success", "tc", 6);
                _this.setState({loadAddTeam: true, teamModal: false, teamSelectorError: ''})
                _this.componentDidMount();

            }).catch(function (error) {
                _this.setState({teamSelectorError: 'Team already registered'});
            })

        }
    }

    renderIfEventFound() {
        if (this.state.eventDetail !== null && Object.keys(this.state.eventDetail).length !== 0) {
            //only display delete events if an admin
            let showActionBar=null;
            if(this.state.showDeleteBtn) {
                showActionBar = <TableHeaderColumn>Action</TableHeaderColumn>
            }
            return (
                <MuiThemeProvider>
                    <Row>
                        <Col md={8} mdOffset={2} xs={7}>
                            <Panel bsStyle="info">
                                <Panel.Heading>Event </Panel.Heading>
                                <Panel.Body>
                                    <PageHeader>
                                        {this.state.eventDetail.name} <br/>
                                        <Divider/>
                                        <small
                                            style={{'overflow-wrap': 'break-word'}}>{this.state.eventDetail.description}</small>
                                    </PageHeader>
                                </Panel.Body>
                            </Panel>
                        </Col>
                        <Divider/>
                    </Row>
                    <Row>
                        <Col md={6} xs={8}>
                            <Panel bsStyle="info">
                                <Panel.Heading>Event Details</Panel.Heading>
                                <Panel.Body><h4>Event Date : {this.state.eventDate} </h4><br/><br/>
                                    <Divider/>
                                    <h4>Start Time : {this.state.startTime} </h4> <br/> <br/>
                                    <Divider/><br/>
                                    <h4> End Time : {this.state.endTime} </h4></Panel.Body>
                            </Panel>
                        </Col>
                        <Col md={6} xs={8}>
                            <Panel bsStyle="info">
                                <Panel.Heading>Building: {this.state.buildingName} ----
                                    Room: {this.state.eventDetail.room.roomName}</Panel.Heading>
                                <Panel.Body>
                                    <div id="map"
                                         style={{height: 300, width: 400, marginLeft: 'auto', marginRight: 'auto'}}>
                                        <Map
                                            style={this.divStyle}
                                            google={this.props.google}
                                            zoomControl={true}
                                            initialCenter={{
                                                lat: 41.306610,
                                                lng: -76.015437
                                            }}
                                            zoom={16}
                                            clickableIcons={false}>
                                            {this.addMarker()}
                                        </Map>
                                    </div>

                                </Panel.Body>

                            </Panel>
                        </Col>


                    </Row>
                    <Row>
                        <Col md={6} xs={8}>
                            <Panel bsStyle="info">
                                <Panel.Heading>Judges</Panel.Heading>
                                <Panel.Body><Table selectable={false}>
                                    <TableHeader displaySelectAll={false}
                                                 adjustForCheckbox={false}>
                                        <TableRow>
                                            <TableHeaderColumn>First Name</TableHeaderColumn>
                                            <TableHeaderColumn>Last Name</TableHeaderColumn>
                                            {showActionBar}
                                        </TableRow>
                                    </TableHeader>
                                    {this.renderIfJudgesFound()}

                                </Table></Panel.Body>
                            </Panel>
                        </Col>
                        <Col md={6} xs={8}>
                            <Panel bsStyle="info">
                                <Panel.Heading>Teams</Panel.Heading>
                                <Panel.Body><Table selectable={false}>
                                    <TableHeader displaySelectAll={false}
                                                 adjustForCheckbox={false}>
                                        <TableRow>
                                            <TableHeaderColumn>Team Name</TableHeaderColumn>
                                            <TableHeaderColumn>School Name</TableHeaderColumn>
                                            {showActionBar}
                                        </TableRow>
                                    </TableHeader>
                                    {this.renderIfTeamsFound()}
                                </Table></Panel.Body>
                            </Panel>
                        </Col>

                    </Row>
                </MuiThemeProvider>
            )
        }
    }

    //Return the judges for this event, only show first and last name
    renderIfJudgesFound() {
        if (this.state.judgesDetail !== null && Object.keys(this.state.judgesDetail).length !== 0) {
            let deleteBtnJudge = null;
            return (
                <TableBody displayRowCheckbox={false}
                           showRowHover={true}>
                    {
                        Object.keys(this.state.judgesDetail).map(function (key) {
                            if(this.state.showDeleteBtn) {
                                deleteBtnJudge=  <TableRowColumn><RaisedButton icon={<FontIcon className="pe-7s-trash" />}
                                                              secondary={true} label="Delete"
                                                              onClick={this.confirmJudgeDelete.bind(this, this.state.judgesDetail[key])}/>
                                                </TableRowColumn>
                            }
                            return (
                                <TableRow key={key}>
                                    <TableRowColumn>{this.state.judgesDetail[key].firstName}</TableRowColumn>
                                    <TableRowColumn>{this.state.judgesDetail[key].lastName}</TableRowColumn>
                                    {deleteBtnJudge}

                                </TableRow>
                            )

                        }, this)
                    }
                </TableBody>
            )
        }
    }

    confirmJudgeDelete = (s) => {
        this.setState({
            confirmDialog:true,
            confirmMessage:'Are you sure you want to delete the following judge:  ' + s.firstName + " " + s.lastName,
            deleteTeam:false,
            deleteJudge:true,
            deleteId:s.id
        })
    }

    removeJudge() {

        var _this = this;
        var removeId = _this.state.deleteId;
        //just making remove a post for now
        _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + "/sweng500/event/"+this.state.eventId+"/removeJudge/" + removeId, "DELETE", constants.useCredentials(), null, true).then(function (result) {
            _this.setState({confirmDialog: false});
            _this.props.addNotification(
                "Success: The judge has been removed",
                "info",
                "tc",
                6
            );
            _this.componentDidMount();
        }).catch(function (error) {
            _this.setState({confirmDialog: false});
            _this.props.addNotification(
                "Error: The judge could not be removed",
                "error",
                "tc",
                6
            );
        })
    }

    //Return the judges for this event, only show first and last name
    renderIfTeamsFound() {
        if (this.state.teamsDetail !== null && Object.keys(this.state.teamsDetail).length !== 0) {
            let deleteBtnTeam =null;

            return (
                <TableBody displayRowCheckbox={false}
                           showRowHover={true}>
                    {
                        Object.keys(this.state.teamsDetail).map(function (key) {
                            if(this.state.showDeleteBtn) {
                                deleteBtnTeam= <TableRowColumn> <RaisedButton icon={<FontIcon className="pe-7s-trash" />}
                                                              secondary={true} label="Delete"
                                                              onClick={this.confirmTeamDelete.bind(this, this.state.teamsDetail[key])}/>
                                </TableRowColumn>
                            }
                            return (
                                <TableRow key={key}>
                                    <TableRowColumn>{this.state.teamsDetail[key].name}</TableRowColumn>
                                    <TableRowColumn>{this.state.teamsDetail[key].school.schoolName}</TableRowColumn>
                                    {deleteBtnTeam}

                                </TableRow>
                            )

                        }, this)
                    }
                </TableBody>
            )
        }
    }
    confirmTeamDelete = (s) => {
        this.setState({
            confirmDialog:true,
            confirmMessage:'Are you sure you want to delete the following team: ' + s.name,
            deleteTeam:true,
            deleteJudge:false,
            deleteId:s.id
        })
    }

    removeTeam() {
        var _this = this;
        var removeId = _this.state.deleteId;
        //just making remove a post for now
        _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + "/sweng500/event/"+this.state.eventId+"/removeTeam/" + removeId, "DELETE", constants.useCredentials(), null, true).then(function (result) {
            _this.setState({confirmDialog: false});
            _this.props.addNotification(
                "Success: The team has been removed",
                "info",
                "tc",
                6
            );
            _this.componentDidMount();
        }).catch(function (error) {
            _this.setState({confirmDialog: false});
            _this.props.addNotification(
                "Error: The team could not be removed",
                "error",
                "tc",
                6
            );
        })
    }

    closeConfirmDialog = () => {
        this.setState({confirmDialog: false});
    }

    render() {
        let deleteActions=null;
        if(this.state.deleteTeam) {
             deleteActions = [
                <FlatButton
                    label="Cancel"
                    primary={true}
                    onClick={this.closeConfirmDialog}
                />,
                <FlatButton
                    label="Delete"
                    primary={true}
                    onClick={this.removeTeam}
                />,
            ];
        } else {
             deleteActions = [
                <FlatButton
                    label="Cancel"
                    primary={true}
                    onClick={this.closeConfirmDialog}
                />,
                <FlatButton
                    label="Delete"
                    primary={true}
                    onClick={this.removeJudge}
                />,
            ];
        }
        let modalTitleBar = <AppBar
            iconElementRight={<FlatButton label="Close"/>}
            showMenuIconButton={false}
            onRightIconButtonClick={(event) => this.closeTeamModal()}
            title="Register a team to an event"
        />

        let cardButtons=null;
        //only show register buttons to admins and coaches
        if (this.state.showRegisterBtn) {
            cardButtons = <div><RaisedButton icon={<FontIcon className="pe-7s-angle-left-circle"/>} primary={true}
                                        label="Go back to events"
                                        onClick={event => this.props.showEvents(event)}/>&nbsp;&nbsp;
                <RaisedButton icon={<FontIcon className="pe-7s-study"/>} primary={true} label="Register a Team"
                          onClick={event => this.showTeamModal(event)}/></div>

        } else {
            cardButtons =   <RaisedButton icon={<FontIcon className="pe-7s-angle-left-circle" />} primary={true} label="Go back to events"
                                          onClick={event => this.props.showEvents(event)}/>
        }
        return (
            <div className="content">

                <MuiThemeProvider>
                    <Grid fluid>
                        <Row>
                            <Col md={12}>
                                <Card
                                    hCenter={this.state.eventDetail.eventName}
                                    // title={this.state.eventDetail.eventName}
                                    category={
                                        <div>
                                            {cardButtons}
                                        </div>}
                                    content={
                                        <Loader color="#3498db" loaded={this.state.loading}>
                                            {this.renderIfEventFound()}
                                        </Loader>
                                    }/>
                            </Col>
                        </Row>
                    </Grid>
                    <Modal bsSize="medium" show={this.state.teamModal} onHide={this.closeTeamModal}>
                        <Modal.Header>
                            <Modal.Title> {modalTitleBar}</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <Grid>
                                <Row>
                                    <Col xs={7} md={3}>
                                        <CustomDropdown
                                            name={"team"}
                                            labelText={"Team"}
                                            hintText={"Select team"}
                                            selected={this.state.selectedTeamValue}
                                            endpoint={"/sweng500/getTeamsByUser"}
                                            sortKey={"name"}
                                            textKeys={["name"]}
                                            selectedValue={this.selectedTeam}
                                            errorText={this.state.teamSelectorError}
                                        />
                                    </Col>
                                </Row>
                            </Grid>
                        </Modal.Body>

                        <Modal.Footer>
                            <Loader loaded={this.state.loadAddTeam}></Loader>
                            <RaisedButton icon={<FontIcon className="pe-7s-like2"/>} primary={true}
                                          label="Register Team"
                                          onClick={event => this.registerTeam()}/>
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

        )
    }

    showTeamModal(event) {
        this.setState({teamModal: true})
    }
}

export default GoogleApiWrapper({
    apiKey: "AIzaSyC7xiiV97LyRQd-GB9aBmiJaYFGW5DVIbM"
})(EventDetail);