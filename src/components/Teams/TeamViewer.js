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
            modal: false
        }

        this.updateTeam = this.updateTeam.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
        this.deleteTeamButtonClicked = this.deleteTeamButtonClicked.bind(this);
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
        console.log(team);
        console.log(removeId);
        _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + "/sweng500/removeTeam/" + removeId, "DELETE", constants.useCredentials(), null, true).then(function (result) {
            var tempTeams = _this.state.teams.filter(t => {
                return t !== team;
            });

            _this.setState({
                teams: tempTeams,
                teamToDelete: null,
                modal:false
            });

            _this.props.addNotification(<div><b>{team.name}</b> has been deleted.</div>);
        }).catch(function (error) {
            _this.props.addNotification(<div><b>{team.name}</b> could not be deleted because: <em>{error.message}</em></div>, 'error');
        })
    }

    getTeams() {
        var _this = this;

        _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + '/sweng500/getTeams', 'GET', constants.useCredentials(), null, true).then(function (result) {
            console.log(result.body);
            let resultTeams = result.body;

            for(let value in resultTeams) {
                resultTeams[value].menuActions = <div><RaisedButton
                    secondary={true} onClick={event => {_this.deleteTeamButtonClicked(resultTeams[value])}} label="Delete"/></div>;
            }

            _this.setState({teams: resultTeams})
        }).catch(function (error) {
            console.log(error);
        })
    }

    componentWillMount() {
        this.getTeams();
    }

    updateTeam(updatedTeam) {
        var tempTeams = this.state.teams;

        tempTeams.map(function (team) {
            if(team.id === updatedTeam.id) {
                team.students = updatedTeam.students;
            }
        });

        this.setState({
            teams: tempTeams
        })
    }

    render() {
        const columns = [{
            Header: 'Team Name',
            filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, {keys: ["name"]}),
            filterAll: true,
            accessor: 'name' // String-based value accessors!
        }, {
            Header: 'Coach',
            filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, {keys: ["coach.name"]}),
            filterAll: true,
            accessor: 'coach.name' // String-based value accessors!
        }, {
            Header: 'School',
            filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, {keys: ["school.schoolName"]}),
            filterAll: true,
            accessor: 'school.schoolName' // String-based value accessors!
        },
        {
            Header: 'Actions',
            accessor: 'menuActions', // String-based value accessors!
            style:{textAlign:'center'},
            sortable: false,
            filterable: false
        }];

        return (
            <div>
                <ReactTable
                    data={this.state.teams}
                    columns={columns}
                    filterable
                    defaultFilterMethod={(filter, row) =>
                        String(row[filter.id]) === filter.value }
                    defaultPageSize={10}
                    className="-striped -highlight"
                    defaultSorted={[{id: "name"}]}
                    SubComponent={row => (
                        <StudentViewer teamProp={row.original} updateTeam={this.updateTeam}/>
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

}

export default TeamViewer;