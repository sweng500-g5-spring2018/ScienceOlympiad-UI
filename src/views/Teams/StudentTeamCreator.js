import React, {Component} from 'react';
import {MuiThemeProvider, Dialog, Popover, Menu, MenuItem} from 'material-ui';
import Button from '../../elements/CustomButton/CustomButton';
import {Panel, PanelGroup} from 'react-bootstrap';

import StudentAdder from "../../components/Students/StudentAdder";
import TeamAdder from "../../components/Teams/TeamAdder";

class StudentTeamCreator extends Component {
    constructor(props) {
        super(props);

        this.state = {
            popOverOpen: false,
            addPanel: "",
        };

        this.handleAddClick = this.handleAddClick.bind(this);
        this.toggleAdd = this.toggleAdd.bind(this);
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
                <div style={{textAlign: 'center'}}>
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
                        onSelect={() => {}}
                        key="add-collapsible-panel-group"
                    >
                        <Panel id="add-user-collapsible-panel" eventKey={"student"} style={{border: 0}}>
                            <Panel.Body collapsible>
                                <br />
                                <StudentAdder togglePanel={this.toggleAdd} updateTable={this.props.updateTable}/>
                            </Panel.Body>
                        </Panel>
                        <Panel id="add-team-collapsible-panel" eventKey={"team"} style={{border:0}}>
                            <Panel.Body collapsible>
                                <TeamAdder togglePanel={this.toggleAdd} updateTable={this.props.updateTable}/>
                            </Panel.Body>
                        </Panel>
                    </PanelGroup>
                </div>
            </MuiThemeProvider>
        )
    }

}

export default StudentTeamCreator;