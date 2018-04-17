import React, { Component } from 'react';
import PropTypes from 'prop-types';
import HttpRequest from "../../adapters/httpRequest";
import constants from "../../utils/constants";
import {StatsCard} from '../../components/Cards/StatsCard.js';

class TodaysEvents extends Component {

    constructor(props) {
        super(props);

        this.state = {
            result: []
        };

        this.getEvents();

        this.getEvents = this.getEvents.bind(this);
    }

    getEvents(event) {
        if(event) {event.preventDefault() };

        var _this = this;
        _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + "/sweng500/events", "get", constants.useCredentials(), null, true).then(function (result) {
            _this.setState({
                result: result.body
            })
            console.log(result.body);
        }).catch(function (error) {
            console.log(error);
        })
    }

    formatBody(){

        var namesList = this.state.result.map(function(user, i) {
                return <li key={i}>{user.name}</li>
            }
        )

        return (
        <div id="contact-chuck-container-div" key="contact-chuck-container-div" className="chuckNorrisClass">
            <ol> {namesList} </ol>
            <div className="footer">
                <hr />
                <div className="stats">
                    <a style={{cursor:'pointer'}} onClick={event => this.getEvents(event)}><i className="fa fa-refresh"></i> Update Now</a>
                </div>
            </div>
        </div>
        );
    }

    render() {



        return (
            <StatsCard
                bigIcon={<i className="pe-7s-global text-warning"></i>}
                statsText="Upcoming Events"
                statsValue={this.formatBody()}
            />

        );
    }

}

export default TodaysEvents;
