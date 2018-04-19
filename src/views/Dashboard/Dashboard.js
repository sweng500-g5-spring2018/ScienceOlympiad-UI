import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import ChuckParent from '../../components/HttpExample/ChuckParent.js'
import TodaysEvents from '../../views/Dashboard/TodaysEvents.js'
import EventCount from "./EventCount";
import TeamCount from "./TeamCount";
import CoachCount from "./CoachCount";
import JudgeCount from "./JudgeCount";
import AuthService from "../../utils/AuthService";
import Card from '../../components/Cards/Card';

class Dashboard extends Component {

    renderDescription() {
        return (
            <Row>
                <Card style={{textAlign: 'center'}}
                    title="PSU Science Olympiad"
                    category="Science Olympiad 101"
                    content="Science Olympiad is a national organization which sponsors science competitions.
                    Each March, Penn State Wilkes-Barre hosts a regional Science Olympiad competition. This
                    event attracts approximately 1,000 students and 500 additional visitors.  Science Olympiad
                    competitions are like academic track meets, consisting of a series of 23 team events in
                    each school division level. Each year, a portion of the events are rotated to reflect the
                    ever-changing nature of genetics, earth science, chemistry, anatomy, physics, geology,
                    mechanical engineering and technology. By combining events from all disciplines, Science Olympiad
                    encourages a wide cross-section of students to get involved. Emphasis is placed on active, hands-on
                    group participation. Through Science Olympiad, students, teachers, parents, principals and
                    business leaders bond together and work toward a shared goal. After competing at the regional
                    competition the top students move on to nationals."
                    />
            </Row>
        )
    }

    render() {

        const userType = AuthService.getUserRole();

        if (userType === "ADMIN") {

            return (
                <div className="content">
                    <Grid fluid>
                        {this.renderDescription()}
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
                    {this.renderDescription()}
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
                        {this.renderDescription()}
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
                        {this.renderDescription()}
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
