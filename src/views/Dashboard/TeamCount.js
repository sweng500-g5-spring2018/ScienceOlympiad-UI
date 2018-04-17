import React, { Component } from 'react';
import HttpRequest from "../../adapters/httpRequest";
import constants from "../../utils/constants";
import {StatsCard} from '../../components/Cards/StatsCard.js';

class TeamCount extends Component {

    constructor(props) {
        super(props);

        this.state = {
            result: []
        };

        this.getTeams();

        this.getTeams = this.getTeams.bind(this);
    }

    getTeams() {

        var _this = this;
        _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + "/sweng500/getTeams", "get", constants.useCredentials(), null, true).then(function (result) {
            _this.setState({
                result: result.body
            })
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
                        <a style={{cursor:'pointer'}} onClick={this.getTeams}><i className="fa fa-refresh"></i> Update Now</a>
                    </div>
                </div>
            </div>
        );
    }

    render() {

        return (
            <StatsCard
                bigIcon={<i className="pe-7s-graph1 text-warning"></i>}
                statsText="Number of Teams"
                statsValue={this.formatBody()}
            />
        );
    }

}

export default TeamCount;
