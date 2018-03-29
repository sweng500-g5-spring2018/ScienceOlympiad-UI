import React, {Component} from 'react';
import {MuiThemeProvider} from 'material-ui';

import TeamViewer from "../../components/Teams/TeamViewer";
import StudentTeamCreator from "./StudentTeamCreator";
import {style} from "../../variables/Variables";

import NotificationSystem from 'react-notification-system';

class TeamManagement extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tableUpdateToggler: false,
            _notificationSystem: null
        }

        this.updateTable = this.updateTable.bind(this);
        this.addNotification = this.addNotification.bind(this);
    }

    updateTable() {
        this.setState({
            tableUpdateToggler: !this.state.tableUpdateToggler
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
        this.setState({_notificationSystem: this.refs.notificationSystem});
    }
    render() {
        return (
            <MuiThemeProvider>
                <div className="content" style={{textAlign: 'center'}}>
                    <NotificationSystem ref="notificationSystem" style={style}/>
                    <StudentTeamCreator updateTable={this.updateTable} addNotification={this.addNotification}/>
                    <TeamViewer tableUpdateToggler={this.state.tableUpdateToggler} addNotification={this.addNotification} />
                </div>
            </MuiThemeProvider>
        )
    }

}

export default TeamManagement;