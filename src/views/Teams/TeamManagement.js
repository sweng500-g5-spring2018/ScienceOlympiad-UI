import React, {Component} from 'react';
import {MuiThemeProvider, Dialog, Popover, Menu, MenuItem, RaisedButton} from 'material-ui';
import Button from '../../elements/CustomButton/CustomButton';
import {Grid, Row, Col, Panel, PanelGroup} from 'react-bootstrap';

import ReactTable from 'react-table';
import StudentAdder from "./StudentAdder";
import TeamAdder from "./TeamAdder";

class TeamManagement extends Component {
    constructor(props) {
        super(props);

        this.state = {
            popOverOpen: false,
            addPanel: ""
        };

        this.handleAddClick = this.handleAddClick.bind(this);
    }

    handleAddClick(event) {
        event.preventDefault();

        this.setState({
            popOverOpen: true,
            anchorEl: event.currentTarget
        });
    }


    toggleAdd(type) {
        this.setState({popOverOpen: false, addPanel: type});
    }

    render() {
        return (
            <MuiThemeProvider>
                <div className="content">
                    <Button fill bsStyle="info" onClick={this.handleAddClick}>Add Student/Team</Button>
                    <Popover
                        open={this.state.popOverOpen}
                        anchorEl={this.state.anchorEl}
                        anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                        targetOrigin={{horizontal: 'left', vertical: 'top'}}
                        onRequestClose={ () => {this.setState({popOverOpen: false})}}
                    >
                        <Menu>
                            <MenuItem primaryText="Add Student" onClick={ () => this.toggleAdd("student")}/>
                            <MenuItem primaryText="Add Team" onClick={ () => this.toggleAdd("team")}/>
                        </Menu>
                    </Popover>
                    <PanelGroup
                        id="add-collapsible-panel-group"
                        accordion
                        activeKey={this.state.addPanel}
                    >
                        <Panel id="add-user-collapsible-panel" eventKey={"student"} style={{border: 0}}>
                            <Panel.Body collapsible>
                                HA HA HA STUDENT <br />
                                <StudentAdder/>
                            </Panel.Body>
                        </Panel>
                        <Panel id="add-team-collapsible-panel" eventKey={"team"} style={{border:0}}>
                            <Panel.Body collapsible>
                                HA HA HA Team
                                <TeamAdder/>
                            </Panel.Body>
                        </Panel>
                    </PanelGroup>
                </div>
            </MuiThemeProvider>

        )
    }

}

export default TeamManagement;