import React, {Component} from 'react';
import {RaisedButton, AppBar, FontIcon, FlatButton} from 'material-ui';
import ReactTable from 'react-table';
import constants from "../../utils/constants";
import HttpRequest from "../../adapters/httpRequest";
import matchSorter from "match-sorter";
import StudentViewer from "../Students/StudentViewer";

import {Modal} from 'react-bootstrap';

class TeamViewer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            teams: [],
            teamToDelete: null,
            modal: false,
            expanded: {}
        };

        this.updateTeam = this.updateTeam.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
        this.deleteTeamButtonClicked = this.deleteTeamButtonClicked.bind(this);
        this.handleRowExpanded = this.handleRowExpanded.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.tableUpdateToggler !== nextProps.tableUpdateToggler) {
            this.getTeams();
        }
    }

    // Close the modal
    closeModal() {
        this.setState({
            modal: false
        })
    }

    // Close the modal
    openModal() {
        this.setState({
            modal: true
        })
    }

    deleteTeamButtonClicked(team) {
        this.setState({
            teamToDelete: team,
            modal: true
        })
    }

    deleteTeam(team) {
        var _this = this;
        var removeId = team.id;

        _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + "/sweng500/removeTeam/" + removeId, "DELETE", constants.useCredentials(), null, true).then(function (result) {
            var tempTeams = _this.state.teams.filter(t => {
                return t !== team;
            });

            _this.setState({
                teams: tempTeams,
                teamToDelete: null,
                modal:false,
                expanded: {}
            });

            _this.props.addNotification(<div>Team <b>{team.name}</b> has been deleted.</div>);
        }).catch(function (error) {
            _this.props.addNotification(<div>Team <b>{team.name}</b> could not be deleted because: <em>{error.message}</em></div>, 'error');
        })
    }

    getTeams() {
        var _this = this;

        _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + '/sweng500/getTeams', 'GET', constants.useCredentials(), null, true).then(function (result) {
            let resultTeams = result.body;

            resultTeams.forEach(function (team) {
                _this.addButtonsToTeam(team);
            });

            _this.setState({teams: resultTeams, expanded: {}})
        }).catch(function (error) {
            _this.props.addNotification(<div>Could not retrieve teams at this time. Try again later.</div>, 'error');
            console.log(error);
        })
    }

    componentWillMount() {
        this.getTeams();
    }

    updateTeam(updatedTeam, viewIndex) {
        var tempTeams = this.state.teams;

        tempTeams.forEach(function (team) {
            if(team.id === updatedTeam.id) {
                this.addButtonsToTeam(updatedTeam);

                team.students = updatedTeam.students;
            }
        }, this);

        this.setState({
            teams: tempTeams
        });

        this.handleRowExpanded({}, viewIndex);
    }

    addButtonsToTeam(team) {
        team.menuActions =
            <div>
                <RaisedButton icon={<FontIcon className="pe-7s-trash" />} secondary={true} onClick={event => {this.deleteTeamButtonClicked(team)}} label="Delete Team"/>
            </div>;

        for(let studIndex in team.students) {
            team.students[studIndex].menuActions =
                <div>
                    <RaisedButton icon={<FontIcon className="pe-7s-less" />} backgroundColor="#FFC300" onClick={event => {console.log("Remove Stud from Team Clicked!!!")}} label="Remove"/>
                    &nbsp;&nbsp;
                    <RaisedButton icon={<FontIcon className="pe-7s-trash" />} secondary={true} onClick={event => {console.log("DELETE STUDENT CLICKED")}} label="Delete"/>
                </div>;
        }
    }

    handleRowExpanded(newExpanded, index, event) {
        if(this.state.expanded[index]) {
            this.setState({
                expanded: {[index]: false}
            })
        } else {
            this.setState({
                // we override newExpanded, keeping only current selected row expanded
                expanded: {[index]: true}
            });
        }
    }

    render() {
        return (
            <div>
                <ReactTable
                    data={this.state.teams}
                    columns={this.columns}
                    expanded={this.state.expanded}
                    onExpandedChange={this.handleRowExpanded}
                    filterable
                    defaultFilterMethod={(filter, row) =>
                        String(row[filter.id]) === filter.value }
                    defaultPageSize={10}
                    className="-striped -highlight"
                    defaultSorted={[{id: "name"}]}
                    SubComponent={row => (
                        <StudentViewer teamProp={row.original} viewIndex={row.viewIndex} updateTeam={this.updateTeam} updateTable={this.props.updateTable} addNotification={this.props.addNotification}/>
                    )}
                />
                <Modal show={this.state.modal} onHide={this.closeModal}>
                    <Modal.Header>
                        <Modal.Title> <AppBar
                            iconElementRight={<FlatButton label="Close"/>}
                            showMenuIconButton={false}
                            onRightIconButtonClick={this.closeModal}
                            title="Delete Team"
                        /></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div style={{textAlign: 'center'}}>
                            <b>Are you sure you wish to delete team <u><em>{this.state.teamToDelete != null ? this.state.teamToDelete.name : ''}</em></u> ?</b>
                            <br />
                            Note: This action cannot be undone.
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <RaisedButton icon={<FontIcon className="pe-7s-close-circle" />} primary={true} label="Cancel"
                                      onClick={this.closeModal}/>&nbsp;&nbsp;
                        <RaisedButton icon={<FontIcon className="pe-7s-like2" />} secondary={true} label="Confirm Delete"
                                      onClick={e => {this.deleteTeam(this.state.teamToDelete)}}/>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }

    columns = [
        {
            Header: 'Team Name',
            filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, {keys: ["name"]}),
            filterAll: true,
            accessor: 'name' // String-based value accessors!
        }, {
            Header: 'Coach',
            id: 'coachName',
            filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, {keys: ["coachName"]}),
            filterAll: true,
            accessor: 'coach.name' // String-based value accessors!
        }, {
            Header: 'School',
            id: 'schoolName',
            filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, {keys: ["schoolName"]}),
            filterAll: true,
            accessor: 'school.schoolName' // String-based value accessors!
        },
        {
            Header: 'Actions',
            accessor: 'menuActions', // String-based value accessors!
            style:{textAlign:'center'},
            sortable: false,
            filterable: false
        }
    ];

}

export default TeamViewer;