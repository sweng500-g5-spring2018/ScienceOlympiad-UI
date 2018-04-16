import React, {Component} from 'react';
import {style} from "../../variables/Variables";

import NotificationSystem from 'react-notification-system';
import constants from "../../utils/constants";
import HttpRequest from "../../adapters/httpRequest";
import {RaisedButton, AppBar, FontIcon, FlatButton, MuiThemeProvider, TextField} from 'material-ui';
import ReactTable from "react-table";
import matchSorter from "match-sorter";
import EventScores from './EventScores';

class Scoring extends Component {
    constructor(props) {
        super(props);

        this.state = {
            expanded: {},
            eventTeamsList: undefined,
            _notificationSystem: null
        }

        this.addNotification = this.addNotification.bind(this);
        this.handleRowExpanded = this.handleRowExpanded.bind(this);
        this.updateScores = this.updateScores.bind(this);
    }

    getTeamEvents() {
        var _this = this;

        _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + '/sweng500/getTeamEvents', 'GET', constants.useCredentials(), null, true).then(function (result) {
            let teamEvents = result.body;
            var teamMap = new Map();

            teamEvents.forEach(function (teamEvent) {
                if(teamMap.has(teamEvent.eventId)) {
                    let teamEventUpdate = teamMap.get(teamEvent.eventId);
                    teamEventUpdate.push(teamEvent);
                } else {
                    let teamEventUpdate = [];
                    teamEventUpdate.push(teamEvent);
                    teamMap.set(teamEvent.eventId, teamEventUpdate);
                }
            });

            let eventTeamList = [];

            for(let key of teamMap.keys()) {
                let localEvent = {};
                let teList = teamMap.get(key);

                localEvent.eventId = teList[0].eventId;
                localEvent.eventName = teList[0].eventName;
                localEvent.teams = [... teList];

                let allScored = true;
                teList.forEach(function (te) {
                    if(te.score == null) {
                        allScored = false;
                    }
                });

                localEvent.allScored = allScored ? "Scored" : "Pending";
                eventTeamList.push(localEvent);
            }

            console.log(eventTeamList);

            _this.setState({
                eventTeamsList: eventTeamList
            });

        }).catch(function (error) {
            this.addNotification(<div>Could not retrieve teams at this time. Try again later.</div>, 'error');
            console.log(error);
        })
    }

    updateScores(teamEvent, score) {
        let tempEventTeamsList = this.state.eventTeamsList;

        let eventObjRef;
        let allScored = true;

        for(let i in tempEventTeamsList) {
            if(tempEventTeamsList[i].eventId !== teamEvent.eventId) continue;

            eventObjRef = tempEventTeamsList[i];

            for(let j in tempEventTeamsList[i].teams) {
                if(tempEventTeamsList[i].teams[j].id === teamEvent.id) {
                    tempEventTeamsList[i].teams[j].score = score;
                }

                if(tempEventTeamsList[i].teams[j].score == null) {
                    allScored = false;
                }
            }
        }

        allScored = allScored ? "Scored" : "Pending";

        if(eventObjRef && eventObjRef.allScored !== allScored) {

            console.log("HOLY SHIT RESETTING ALL DA SHIT");
            eventObjRef.allScored = allScored;
            tempEventTeamsList = JSON.parse(JSON.stringify(tempEventTeamsList));
        }

        this.setState({
            eventTeamsList: tempEventTeamsList
        }, () => {
            console.log(this.state.eventTeamsList);
        })
    }

    addNotification(message, level, position, autoDismiss) {
        if(this.state._notificationSystem) {
            this.state._notificationSystem.addNotification({
                title: (<span data-notify="icon" className="pe-7s-info"></span>),
                message: (
                    <div>
                        {message}
                    </div>
                ),
                level: level ? level : 'info',
                position: position ? position : 'tr',
                autoDismiss: autoDismiss ? autoDismiss : 5,
            });
        }
    }



    componentDidMount() {
        this.setState({_notificationSystem: this.refs.notificationSystem}, () => {
            this.getTeamEvents();
        });
    }

    //Handling Row Expansion
    handleRowExpanded(newExpanded, index) {
        this.setState({
            expanded: {[index]: !this.state.expanded[index]}
        })
    }

    render() {
        return (
            <MuiThemeProvider>
                <div className="content" style={{textAlign: 'center'}}>
                    <NotificationSystem ref="notificationSystem" style={style}/>
                    <div>HELLOOOO</div>
                    <ReactTable
                        data={this.state.eventTeamsList}
                        columns={this.columns}
                        expanded={this.state.expanded}
                        onExpandedChange={this.handleRowExpanded}
                        filterable
                        defaultPageSize={10}
                        className="-striped -highlight"
                        defaultSorted={[{id: "eventName"}]}
                        SubComponent={row => (
                            <EventScores teams={row.original.teams} label={row.original.eventName} updateScores={this.updateScores} addNotification={this.addNotification}/>

                        )}
                    />
                </div>
            </MuiThemeProvider>
        )
    }

    columns = [
        {
            Header: 'Event Name',
            filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, {keys: ["eventName"]}),
            filterAll: true,
            accessor: 'eventName' // String-based value accessors!
        },
        {
            Header: 'Scoring Status',
            maxWidth: 200,
            filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, {keys: ["allScored"]}),
            filterAll: true,
            accessor: 'allScored' // String-based value accessors!
        }
    ];

}

export default Scoring;