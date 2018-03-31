import React, {Component} from 'react';
import {MenuItem, RaisedButton, SelectField} from 'material-ui';
import Button from '../../elements/CustomButton/CustomButton';
import {Panel} from 'react-bootstrap';
import FontIcon from 'material-ui/FontIcon';

import ReactTable from 'react-table';
import constants from "../../utils/constants";
import HttpRequest from "../../adapters/httpRequest";
import matchSorter from "match-sorter";

class StudentViewer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            studentsSelectable: [],
            selectedStudents: [],
            openStudentSelector: false
        };

        this.studentMenuItems = this.studentMenuItems.bind(this);
        this.selectionRenderer = this.selectionRenderer.bind(this);
        this.toggleStudentSelector = this.toggleStudentSelector.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    toggleStudentSelector() {
        this.setState({openStudentSelector: false, selectedStudents: []});
    }

    handleSubmit() {
        this.setState({
            openStudentSelector: false
        });

        var body = JSON.parse(JSON.stringify(this.props.teamProp));

        this.state.selectedStudents.forEach(function (student) {
            body.students.push(student);
        });

        var _this = this;
        _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + '/sweng500/updateStudentsInTeam', 'POST', constants.useCredentials(), body, true).then(function (result) {
            var updatedTeam = result.body;

            _this.props.updateTeam(updatedTeam, _this.props.viewIndex);
            _this.props.addNotification(<div><b>{body.name}</b> has been updated.</div>);
        }).catch(function (error) {
            _this.props.addNotification(<div><b>{body.name}</b> could not be updated at this time.</div>, 'error');
            console.log(error.message);
        });
    }

    getStudentsInSchoolDistrict(schoolId) {
        var promise = new Promise(function (resolve, reject) {

            HttpRequest.httpRequest(constants.getServerUrl() + '/sweng500/getStudentsFromSchool/?schoolId=' + schoolId, 'GET', constants.useCredentials(), null, true).then(function (result) {
                resolve(result.body);
            }).catch(function (error) {
                reject(error.message);
            })
        });

        return promise;
    }

    clickAddStudentToTeam(team) {
        var _this = this;

        _this.getStudentsInSchoolDistrict(team.school.id).then(function (students) {
            _this.setState({
                studentsSelectable: students,
                openStudentSelector: true
            })
        }).catch(function (error) {
            _this.setState({
                studentsSelectable: [],
                openStudentSelector: true
            });

            console.log(error);
        });
    }

    renderSelectFieldIfContent() {
        if(this.state.studentsSelectable && this.state.studentsSelectable.length > 0) {
            return (
                <SelectField
                    multiple={true}
                    autoWidth={true}
                    hintText="Select Students"
                    selectionRenderer={this.selectionRenderer}
                    value={this.state.selectedStudents}
                    onChange={ (event, index, values) => this.setState({selectedStudents: values})}
                >
                    {this.studentMenuItems()}
                </SelectField>
            )
        } else {
            return (
                <div><b>No students are currently available to be assigned to a new team within this district</b></div>
            )
        }
    }

    selectionRenderer() {
        switch (this.state.selectedStudents.length) {
            case 0:
                return '';
            case 1:
                return this.state.selectedStudents[0].firstName + " " + this.state.selectedStudents[0].lastName + " selected";
            default:
                return `${this.state.selectedStudents.length} names selected`;
        }
    }

    studentMenuItems() {
        return this.state.studentsSelectable.map((student) => (
            <MenuItem
                key={student.id}
                insetChildren={true}
                checked={this.state.selectedStudents.indexOf(student) > -1}
                value={student}
                primaryText={student.firstName + " " + student.lastName}
            />
        ));
    }

    render() {
        return (
            <div>
                <div style={{padding:'20px'}}>
                    <div style={{textAlign: 'center', fontSize: 'large'}}>
                        <em>Students in team: <b>{this.props.teamProp.name}</b></em>
                    </div>
                    <ReactTable
                        data={this.props.teamProp.students}
                        columns={this.columns2}
                        filterable
                        defaultFilterMethod={(filter, row) =>
                            String(row[filter.id]) === filter.value }
                        defaultPageSize={this.props.teamProp.students.length}
                        showPagination={false}
                        className="-striped -highlight"
                        defaultSorted={[{id: "firstName"}]}
                    />
                    <br />
                    <div>
                        <Button fill bsStyle="info" onClick={event => {this.clickAddStudentToTeam(this.props.teamProp)}} disabled={this.state.openStudentSelector}>
                            Add Students to <b>{this.props.teamProp.name}</b>
                        </Button>
                        <br />
                        <Panel id="student-to-team-collapsible-panel" expanded={this.state.openStudentSelector} onToggle={ () => {}}
                               style={{border: 0, width: '50%', marginLeft: '25%', marginRight: '25%'}}>
                            <Panel.Body collapsible>
                                {
                                    this.renderSelectFieldIfContent()
                                }
                                <br />
                                <RaisedButton icon={<FontIcon className="pe-7s-close-circle" />} label="Cancel"
                                              onClick={this.toggleStudentSelector}/>&nbsp;&nbsp;
                                <RaisedButton icon={<FontIcon className="pe-7s-like2" />} primary={true} label="Add Students"
                                              onClick={this.handleSubmit} disabled={this.state.selectedStudents.length === 0 ? true : false}/>
                            </Panel.Body>
                        </Panel>
                    </div>
                </div>
            </div>
        )
    }

    columns2 = [
        {
            Header: 'First Name',
            filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, {keys: ["firstName"]}),
            filterAll: true,
            accessor: 'firstName' // String-based value accessors!
        },
        {
            Header: 'Last Name',
            filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, {keys: ["lastName"]}),
            filterAll: true,
            accessor: 'lastName' // String-based value accessors!
        },
        {
            Header: 'Email',
            filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, {keys: ["emailAddress"]}),
            filterAll: true,
            accessor: 'emailAddress' // String-based value accessors!
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

export default StudentViewer;