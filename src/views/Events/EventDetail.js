import React, {Component} from 'react';
import {Panel,Grid, Col, Row, Modal} from 'react-bootstrap';
import HttpRequest from "../../adapters/httpRequest";
import constants from "../../utils/constants";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import "react-table/react-table.css";




class EventDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //needed so initial backend call will not have blank eventid
            eventId: props.eventId,

            eventDetail :{},
            judgesDetail :{}
        };

    }

    //This componet gets called initially with main events page, need to update when this is called with a no prop
    componentWillReceiveProps(nextProps) {
        var _this = this;
        console.log(nextProps.eventId)
        _this.setState({
            eventId : nextProps.eventId
        });
    }
    componentDidMount() {
        console.log("component did mount")
        var _this = this;

            _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + "/sweng500/event/" + this.state.eventId, "get", constants.useCredentials(), null, true).then(function (result) {
                console.log("getting event");
                _this.setState({
                    eventDetail: result.body
                })



            }).catch(function (error) {
                console.log(error);
            })
        /**
        _this.serverRequestJudge = HttpRequest.httpRequest(constants.getServerUrl() + "/sweng500/event/judges/" + _this.state.eventId, "get", constants.useCredentials(), null).then(function (judgeResult) {
            console.log("getting judges");
            _this.setState({
                judgesDetail: judgeResult.body,
            })


        }).catch(function (error) {
            console.log(error);
        })
         */



    }
    renderIfEventFound() {
        if (this.state.eventDetail !== null && Object.keys(this.state.eventDetail).length !== 0) {
          return (

                  <Row>
                      <h1>{this.state.eventDetail.name}</h1>

                      <Col md={5}>

                          <Panel bsStyle="info">
                              <Panel.Heading>Description</Panel.Heading>
                              <Panel.Body>{this.state.eventDetail.description}</Panel.Body>
                          </Panel>
                          <Panel bsStyle="info">
                              <Panel.Heading>Building</Panel.Heading>

                          </Panel>
                      </Col>
                      
                  </Row>

          )

        }

    }

    render() {
        console.log("render the details " + this.state.eventId)
        return (
            <div className="content">

                    <MuiThemeProvider>
                        <Grid>
                            <Row className="show-grid">
                                <Col md={4}>
                                    <RaisedButton primary={true} label="Go back to events"
                                                  onClick={event => this.props.showEvents(event) }/>
                                    <br/>
                                </Col>
                            </Row>
                            <br/>
                            <br/>

                                {this.renderIfEventFound()}

                        </Grid>
                    </MuiThemeProvider>

            </div>

        )
    }

}

export default EventDetail;