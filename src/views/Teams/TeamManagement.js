import React, {Component} from 'react';
import {MuiThemeProvider} from 'material-ui';

import TeamViewer from "../../components/Teams/TeamViewer";
import StudentTeamCreator from "./StudentTeamCreator";

class TeamManagement extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tableUpdateToggler: false
        }

        this.updateTable = this.updateTable.bind(this);
    }

    updateTable() {
        this.setState({
            tableUpdateToggler: !this.state.tableUpdateToggler
        })
    }

    render() {
        return (
            <MuiThemeProvider>
                <div className="content" style={{textAlign: 'center'}}>
                    <StudentTeamCreator updateTable={this.updateTable}/>
                    <TeamViewer tableUpdateToggler={this.state.tableUpdateToggler}/>
                </div>
            </MuiThemeProvider>
        )
    }

}

export default TeamManagement;