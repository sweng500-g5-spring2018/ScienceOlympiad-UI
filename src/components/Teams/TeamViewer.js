import React, {Component} from 'react';
import {RaisedButton, AppBar, FontIcon, FlatButton} from 'material-ui';
import ReactTable from 'react-table';
import constants from "../../utils/constants";
import HttpRequest from "../../adapters/httpRequest";
import matchSorter from "match-sorter";
import StudentViewer from "../Students/StudentViewer";

import Loader from 'react-loader'

import {Modal} from 'react-bootstrap';

class TeamViewer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            teams: [],
            selectedTeam: null,
            selectedStudent: null,
            studentToRemoveFromTeam: null,
            modal: false,
            modalInfo: constants.getEmptyModalInfo(),
            expanded: {},
            isLoaded: false
        };

        this.updateTeam = this.updateTeam.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.deleteTeamButtonClicked = this.deleteTeamButtonClicked.bind(this);
        this.handleRowExpanded = this.handleRowExpanded.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.tableUpdateToggler !== nextProps.tableUpdateToggler) {
            this.getTeams();
        }
    }

    componentWillMount() {
        this.getTeams();
    }

    getTeams() {
        var _this = this;

        _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + '/sweng500/getTeams', 'GET', constants.useCredentials(), null, true).then(function (result) {
            let resultTeams = result.body;

            resultTeams.forEach(function (team) {
                _this.addButtonsToTeam(team);
            });

            _this.setState({
                isLoaded:true,
                teams: resultTeams,
                expanded: {},
                selectedTeam: null,
                selectedStudent: null,
                modal:false,
                modalInfo: constants.getEmptyModalInfo(),
            })
        }).catch(function (error) {
            _this.props.addNotification(<div>Could not retrieve teams at this time. Try again later.</div>, 'error');
            console.log(error);
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
                selectedTeam: null,
                selectedStudent: null,
                modal:false,
                modalInfo: constants.getEmptyModalInfo(),
                expanded: {}
            });

            _this.props.addNotification(<div>Team <b>{team.name}</b> has been deleted.</div>, 'success');
        }).catch(function (error) {
            _this.props.addNotification(<div>Team <b>{team.name}</b> could not be deleted because: <em>{error.message}</em></div>, 'error');
        })
    }


    deleteStudent(student) {
        var _this = this;
        var studentId = student.id;

        console.log("TRYING TO DELETE STUDENT");
        console.log(student);

        _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + "/sweng500/deleteStudent/" + studentId, "DELETE", constants.useCredentials(), null, true).then(function (result) {
            _this.props.addNotification(<div>Student <b>{student.firstName + ' ' + student.lastName}</b> has been deleted.</div>, 'success');

            _this.getTeams();

            console.log(result);
        }).catch(function (error) {
            console.log(error);
            _this.props.addNotification(<div>Student <b>{student.firstName + ' ' + student.lastName}</b> could not be deleted because: <em>{error.message}</em></div>, 'error');
        })
    }

    removeStudentFromTeam(student, team) {

        var tempStudents = team.students.filter(s => {
            return s !== student;
        });

        team.students = tempStudents;

        var _this = this;
        _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + '/sweng500/updateStudentsInTeam', 'POST', constants.useCredentials(), team, true).then(function (result) {
            var updatedTeam = result.body;

            var tempTeams = _this.state.teams.filter(t => {
                return t.id !== team.id;
            });

            _this.addButtonsToTeam(updatedTeam);
            tempTeams.push(updatedTeam);

            _this.setState({
                teams: tempTeams,
                selectedTeam: null,
                selectedStudent: null,
                modal:false,
                modalInfo: constants.getEmptyModalInfo(),
                expanded: {}
            });

            _this.props.addNotification(<div><b>{student.firstName + ' ' + student.lastName}</b> has been removed from <b>{team.name}</b>.</div>, 'success');
        }).catch(function (error) {
            _this.props.addNotification(<div><b>{team.name}</b> could not be updated at this time.</div>, 'error');
            console.log(error.message);
        });
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

    // Close the modal
    closeModal() {
        this.setState({
            modal: false,
            selectedTeam: null,
            selectedStudent: null,
            modalInfo: constants.getEmptyModalInfo()
        })
    }

    deleteTeamButtonClicked(team) {
        this.setState({
            selectedTeam: team,
            modal: true,
            modalInfo: {
                title: 'Delete Team',
                body:
                    <div style={{textAlign: 'center'}}>
                        <b>Are you sure you wish to delete team <u><em>{team.name}</em></u>?</b>
                        <br />
                        Note: This action cannot be undone.
                    </div>,
                modalAction: 'DELETE'
            }
        });
    }

    deleteStudentClicked(student) {
        console.log('going to delete student: ' );
        console.log(student);
        this.setState({
            selectedStudent: student,
            modal: true,
            modalInfo: {
                title: 'Delete Student',
                body:
                    <div style={{textAlign: 'center'}}>
                        <b>Are you sure you wish to delete student <u><em>{student.firstName + ' ' + student.lastName}</em></u>?</b>
                        <br />
                        Note: This action cannot be undone.
                    </div>,
                modalAction: 'DELETESTUDENT'
            }
        })
    }

    removeStudentFromTeamButtonClicked(student, team) {
        this.setState({
            selectedStudent: student,
            selectedTeam: team,
            modal: true,
            modalInfo: {
                title: 'Update Team',
                body:
                    <div style={{textAlign: 'center'}}>
                        <b>Are you sure you wish to remove student <u><em>{student.firstName + ' ' + student.lastName}</em></u> from team <u><em>{team.name}</em></u>?</b>
                    </div>,
                modalAction: 'REMOVESTUDENTFROMTEAM'
            }
        })
    }

    handleModalActionClicked(modalAction) {
        switch(modalAction) {
            case 'DELETE':
                this.deleteTeam(this.state.selectedTeam);
                break;
            case 'REMOVESTUDENTFROMTEAM':
                this.removeStudentFromTeam(this.state.selectedStudent, this.state.selectedTeam);
                break;
            case 'DELETESTUDENT':
                console.log("WILL DELETE STUDENT YO");
                this.deleteStudent(this.state.selectedStudent);
                break;
        }
    }

    addButtonsToTeam(team) {
        team.menuActions =
            <div>
                <RaisedButton style={{minWidth: '30%'}} icon={<FontIcon className="pe-7s-trash" />} secondary={true} onClick={event => {this.deleteTeamButtonClicked(team)}} />
            </div>;

        for(let studIndex in team.students) {
            team.students[studIndex].menuActions =
                <div >
                    <RaisedButton style={{minWidth: '40%'}} icon={<FontIcon className="pe-7s-less" />} backgroundColor="#FFC300" onClick={event => { this.removeStudentFromTeamButtonClicked(team.students[studIndex], team) }} />
                    <RaisedButton style={{minWidth: '40%'}} icon={<FontIcon className="pe-7s-trash" />} secondary={true} onClick={event => { this.deleteStudentClicked(team.students[studIndex])}} />
                </div>;
        }
    }

    //Handling Row Expansion
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
                <Loader color="#3498db" loaded={this.state.isLoaded}>
                    <ReactTable
                        data={this.state.teams}
                        columns={this.columns}
                        expanded={this.state.expanded}
                        onExpandedChange={this.handleRowExpanded}
                        filterable
                        defaultPageSize={10}
                        className="-striped -highlight"
                        defaultSorted={[{id: "name"}]}
                        SubComponent={row => (
                            <StudentViewer teamProp={row.original} viewIndex={row.viewIndex} updateTeam={this.updateTeam} updateTable={this.props.updateTable} addNotification={this.props.addNotification}/>
                        )}
                    />
                </Loader>
                <Modal show={this.state.modal} onHide={this.closeModal}>
                    <Modal.Header>
                        <Modal.Title> <AppBar
                            iconElementRight={<FlatButton label="Close"/>}
                            showMenuIconButton={false}
                            onRightIconButtonClick={this.closeModal}
                            title={this.state.modalInfo.title}
                        /></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.state.modalInfo.body}
                    </Modal.Body>
                    <Modal.Footer>
                        <RaisedButton icon={<FontIcon className="pe-7s-close-circle" />} label="Cancel"
                                      onClick={this.closeModal}/>&nbsp;&nbsp;
                        <RaisedButton icon={<FontIcon className="pe-7s-like2" />} primary={true} label="Confirm"
                                      onClick={ () => this.handleModalActionClicked(this.state.modalInfo.modalAction)}/>
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