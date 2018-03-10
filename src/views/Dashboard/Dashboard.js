import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import {StatsCard} from '../../components/Cards/StatsCard.js';
import ChuckParent from '../../components/HttpExample/ChuckParent.js'
import TestModule from "../../components/HttpExample/testModule";

class Dashboard extends Component {

    render() {
        return (
            <div className="content">
                <Grid fluid>
                    <Row>
                        <Col lg={3} sm={6}>
                            <StatsCard
                                bigIcon={<i className="pe-7s-server text-warning"></i>}
                                statsText="Cost of App"
                                statsValue="$100,000"
                                statsIcon={<i className="fa fa-refresh"></i>}
                                statsIconText="Updated now"
                            />
                        </Col>
                        <Col lg={3} sm={6}>
                            <StatsCard
                                bigIcon={<i className="pe-7s-graph1 text-danger"></i>}
                                statsText="App Errors"
                                statsValue="0"
                                statsIcon={<i className="fa fa-clock-o"></i>}
                                statsIconText="In the last hour"
                            />
                        </Col>
                    </Row>
                    <Row>
                        <ChuckParent />
                        <TestModule/>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default Dashboard;
