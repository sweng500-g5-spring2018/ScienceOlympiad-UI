import React, {Component} from 'react';
import {PageHeader, Panel, Grid, Col, Row,} from 'react-bootstrap';
import HttpRequest from "../../adapters/httpRequest";
import constants from "../../utils/constants";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import "react-table/react-table.css";
import {Map, Marker, GoogleApiWrapper} from 'google-maps-react';
import Loader from 'react-loader'
import Card from '../../components/Cards/Card.js';
import Divider from 'material-ui/Divider';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';


class EventDetail extends Component {
    constructor(props) {
        super(props);
        this.formatTimeString = this.formatTimeString.bind(this);
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
            judgesDetail: {}
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
        console.log(nextProps.eventId)
        _this.setState({
            eventId: nextProps.eventId
        });
    }

    componentDidMount() {
        var _this = this;

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
                console.log(error);
            })

        }).catch(function (error) {
            console.log(error);
        })

        _this.serverRequestJudge = HttpRequest.httpRequest(constants.getServerUrl() + "/sweng500/event/judges/" + _this.state.eventId, "get", constants.useCredentials(), null, true).then(function (judgeResult) {
            _this.setState({
                judgesDetail: judgeResult.body,
            })

        }).catch(function (error) {
            console.log(error);
        })
    }

    formatTimeString(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12;
        return hours + ":" + minutes + " " + ampm;
    }

    renderIfEventFound() {
        if (this.state.eventDetail !== null && Object.keys(this.state.eventDetail).length !== 0) {

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
                                        </TableRow>
                                    </TableHeader>

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
            return (
                <TableBody displayRowCheckbox={false}
                           showRowHover={true}>
                    {
                        Object.keys(this.state.judgesDetail).map(function (key) {
                            return (
                                <TableRow key={key}>
                                    <TableRowColumn>{this.state.judgesDetail[key].firstName}</TableRowColumn>
                                    <TableRowColumn>{this.state.judgesDetail[key].lastName}</TableRowColumn>
                                </TableRow>
                            )

                        }, this)
                    }
                </TableBody>
            )
        }
    }

    render() {
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
                                            <RaisedButton primary={true} label="Go back to events"
                                                          onClick={event => this.props.showEvents(event)}/> &nbsp;&nbsp;
                                            <RaisedButton primary={true} label="Register a Team"
                                                          onClick={event => this.props.showEvents(event)}/>
                                        </div>}
                                    content={
                                        <Loader color="#3498db" loaded={this.state.loading}>
                                            {this.renderIfEventFound()}
                                        </Loader>
                                    }/>
                            </Col>
                        </Row>
                    </Grid>
                </MuiThemeProvider>

            </div>

        )
    }
}

export default GoogleApiWrapper({
    apiKey: "AIzaSyC7xiiV97LyRQd-GB9aBmiJaYFGW5DVIbM"
})(EventDetail);