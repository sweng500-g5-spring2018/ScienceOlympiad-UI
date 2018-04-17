import React, { Component } from 'react';
import PropTypes from 'prop-types';
import HttpRequest from "../../adapters/httpRequest";
import constants from "../../utils/constants";
import {StatsCard} from '../../components/Cards/StatsCard.js';

class CoachCount extends Component {

    constructor(props) {
        super(props);

        this.state = {
            result: []
        };

        this.judgeCount();

        this.judgeCount = this.judgeCount.bind(this);
    }

    judgeCount(event) {
        if(event) {event.preventDefault() };

        var _this = this;
        _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + "/sweng500/getJudges", "get", constants.useCredentials(), null, true).then(function (result) {
            _this.setState({
                result: result.body
            })
            console.log(result.body);
        }).catch(function (error) {
            console.log(error);
        })
    }

    formatBody() {

        return (
            <div>
                {this.state.result.length}
                <div className="footer">
                    <hr />
                    <div className="stats">
                        <a style={{cursor:'pointer'}} onClick={event => this.judgeCount(event)}><i className="fa fa-refresh"></i> Update Now</a>
                    </div>
                </div>
            </div>
        );
    }

    render() {

        return (
            <StatsCard
                bigIcon={<i className="pe-7s-graph1 text-warning"></i>}
                statsText="Number of Judges"
                statsValue={this.formatBody()}
            />

        );
    }

}

export default CoachCount;
