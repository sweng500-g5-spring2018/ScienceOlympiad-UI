import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import ChuckParent from '../../components/HttpExample/ChuckParent.js'
import TodaysEvents from '../../views/Dashboard/TodaysEvents.js'
import EventCount from "./EventCount";
import TeamCount from "./TeamCount";
import CoachCount from "./CoachCount";
import JudgeCount from "./JudgeCount";
import AuthService from "../../utils/AuthService";

class Dashboard extends Component {

    render() {

        const userType = AuthService.getUserRole();

        if (userType === "ADMIN") {

            return (
                <div className="content">
                    <Grid fluid>
                        <Row>
                            <Col lg={3} sm={6}>
                                <EventCount/>
                            </Col>
                            <Col lg={3} sm={6}>
                                <TeamCount/>
                            </Col>
                            <Col lg={3} sm={6}>
                                <CoachCount/>
                            </Col>
                            <Col lg={3} sm={6}>
                                <JudgeCount/>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={3} sm={6}>
                                <TodaysEvents/>
                            </Col>
                            <Col lg={3} sm={6}>
                                <ChuckParent/>
                            </Col>
                        </Row>
                    </Grid>
                </div>
            );
        }
        else if (userType == "COACH") {

            return (
            <div className="content">
                <Grid fluid>
                    <Row>
                        <Col lg={3} sm={6}>
                            <EventCount/>
                        </Col>
                        <Col lg={3} sm={6}>
                            <TeamCount/>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={3} sm={6}>
                            <TodaysEvents/>
                        </Col>
                    </Row>
                </Grid>
            </div>
            );
        }
        else if (userType == "JUDGE") {
            return (
                <div className="content">
                    <Grid fluid>
                        <Row>
                            <Col lg={3} sm={6}>
                                <EventCount/>
                            </Col>
                            <Col lg={3} sm={6}>
                                <TeamCount/>
                            </Col>
                            <Col lg={3} sm={6}>
                                <CoachCount/>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={3} sm={6}>
                                <TodaysEvents/>
                            </Col>
                        </Row>
                    </Grid>
                </div>
            );
        }
        else
        {
            return (
                <div className="content">
                    <Grid fluid>
                        <Row>
                            <Col lg={3} sm={6}>
                                <TodaysEvents/>
                            </Col>
                        </Row>
                    </Grid>
                </div>
            );
        }

    }
}

export default Dashboard;
