import React, {Component} from 'react';
import {MuiThemeProvider} from 'material-ui';

import {style} from "../../variables/Variables";

import NotificationSystem from 'react-notification-system';
import constants from "../../utils/constants";
import HttpRequest from "../../adapters/httpRequest";

class Scoring extends Component {
    constructor(props) {
        super(props);

        this.state = {
            _notificationSystem: null
        }

        this.addNotification = this.addNotification.bind(this);
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

            console.log(teamMap);

            _this.setState({
                teamMap: teamMap
            });

            // console.log(result);
            // resultTeams.forEach(function (team) {
            //     _this.addButtonsToTeam(team);
            // });
            //
            // _this.setState({
            //     isLoaded:true,
            //     teams: resultTeams,
            //     expanded: {},
            //     selectedTeam: null,
            //     selectedStudent: null,
            //     modal:false,
            //     modalInfo: constants.getEmptyModalInfo(),
            // })
        }).catch(function (error) {
            _this.props.addNotification(<div>Could not retrieve teams at this time. Try again later.</div>, 'error');
            console.log(error);
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


    render() {
        return (
            <MuiThemeProvider>
                <div className="content" style={{textAlign: 'center'}}>
                    <NotificationSystem ref="notificationSystem" style={style}/>
                    <div>HELLOOOO</div>
                </div>
            </MuiThemeProvider>
        )
    }

}

export default Scoring;