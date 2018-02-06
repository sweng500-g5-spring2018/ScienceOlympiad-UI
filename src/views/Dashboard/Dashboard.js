import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import {StatsCard} from '../../components/StatsCard/StatsCard.js';

import Contact from '../../components/HttpExample/contact.js'

class Dashboard extends Component {

    render() {
        return (
            <div className="content">
                <Grid fluid>
                    <Row>
                        <Col lg={3} sm={6}>
                            <StatsCard
                                bigIcon={<i className="pe-7s-server text-warning"></i>}
                                statsText="Example Card"
                                statsValue="$100"
                                statsIcon={<i className="fa fa-refresh"></i>}
                                statsIconText="Updated now"
                            />
                        </Col>
                        <Col lg={3} sm={6}>
                            <StatsCard
                                bigIcon={<i className="pe-7s-graph1 text-danger"></i>}
                                statsText="Errors"
                                statsValue="23"
                                statsIcon={<i className="fa fa-clock-o"></i>}
                                statsIconText="In the last hour"
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Contact />
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default Dashboard;
