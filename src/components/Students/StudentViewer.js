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
            modal: false,
            modalTitle: "",
            studentsSelectable: [],
            selectedStudents: [],
            openStudentSelector: false
        }

        this.closeModal = this.closeModal.bind(this);
        this.studentMenuItems = this.studentMenuItems.bind(this);
        this.selectionRenderer = this.selectionRenderer.bind(this);
        this.toggleStudentSelector = this.toggleStudentSelector.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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

    toggleStudentSelector() {
        this.setState({openStudentSelector: false, selectedStudents: []});
    }

    handleSubmit() {
        var body = JSON.parse(JSON.stringify(this.props.teamProp));

        this.state.selectedStudents.forEach(function (student) {
            body.students.push(student);
        });

        console.log(body);
        var _this = this;

        _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + '/sweng500/addStudentsToTeam', 'POST', constants.useCredentials(), body, true).then(function (result) {
            var updatedTeam = result.body;

            console.log(updatedTeam);
            _this.props.updateTeam(updatedTeam);

        }).catch(function (error) {
            alert(error.message);
        });
    }

    getStudentsInSchoolDistrict(schoolId) {
        var promise = new Promise(function (resolve, reject) {

            HttpRequest.httpRequest(constants.getServerUrl() + '/sweng500/getStudentsFromSchool/?schoolId=' + schoolId, 'GET', constants.useCredentials(), null, true).then(function (result) {
                console.log(result.body);
                resolve(result.body);
            }).catch(function (error) {
                reject(error.message);
            })
        });

        return promise;
    }

    clickAddStudentToTeam(team) {
        console.log(team);
        var _this = this;

        _this.getStudentsInSchoolDistrict(team.school.id).then(function (students) {
            // _this.setState({
            //     modalTitle: "Add Student to Team",
            //     modalButton: "Submit",
            //     studentsSelectable: students,
            //     modal: true
            // })
            _this.setState({
                studentsSelectable: students,
                openStudentSelector: true
            })
        }).catch(function (error) {
            console.log(error);
        });
    }

    render() {

        const columns2 = [
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
            }
        ];

        return (
            <div>
                <div style={{padding:'20px'}}>
                    <div style={{textAlign: 'center', fontSize: 'large'}}>
                        <em>Students in team: <b>{this.props.teamProp.name}</b></em>
                    </div>
                    <ReactTable
                        data={this.props.teamProp.students}
                        columns={columns2}
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
                            Add Student to <b>{this.props.teamProp.name}</b>
                        </Button>
                        <br />
                        <Panel id="student-to-team-collapsible-panel" expanded={this.state.openStudentSelector} onToggle={ () => {}}
                               style={{border: 0, width: '50%', marginLeft: '25%', marginRight: '25%'}}>
                            <Panel.Body collapsible>
                                {
                                    this.renderSelectFieldIfContent()
                                }
                                <br />
                                <RaisedButton icon={<FontIcon className="pe-7s-close-circle" />} secondary={true} label="Cancel"
                                    onClick={this.toggleStudentSelector}/>&nbsp;&nbsp;
                                <RaisedButton icon={<FontIcon className="pe-7s-like2" />} primary={true} label="Add Students"
                                    onClick={this.handleSubmit} disabled={this.state.selectedStudents.length === 0 ? true : false}/>
                            </Panel.Body>
                        </Panel>
                    </div>
                </div>
                {/*<Modal show={this.state.modal} onHide={this.closeModal}>*/}
                    {/*<Modal.Header>*/}
                        {/*<Modal.Title> <AppBar*/}
                            {/*iconElementRight={<FlatButton label="Close"/>}*/}
                            {/*showMenuIconButton={false}*/}
                            {/*onRightIconButtonClick={(event) => this.closeModal()}*/}
                            {/*title={this.state.modalTitle}*/}
                        {/*/></Modal.Title>*/}
                    {/*</Modal.Header>*/}
                    {/*<Modal.Body>*/}
                        {/*<div>*/}
                            {/*{*/}
                                {/*Object.keys(this.state.studentsSelectable).map(function (studentKey) {*/}
                                    {/*return <li>{this.state.studentsSelectable[studentKey].name}</li>*/}
                                {/*}, this)*/}
                            {/*}*/}
                            {/*<SelectField*/}
                                {/*multiple={true}*/}
                                {/*fullWidth={true}*/}
                                {/*autoWidth={true}*/}
                                {/*hintText="Select Students"*/}
                                {/*selectionRenderer={this.selectionRenderer}*/}
                                {/*value={this.state.selectedStudents}*/}
                                {/*onChange={ (event, index, values) => this.setState({selectedStudents: values})}*/}
                            {/*>*/}
                                {/*{this.studentMenuItems()}*/}
                            {/*</SelectField>*/}
                        {/*</div>*/}
                    {/*</Modal.Body>*/}
                    {/*<Modal.Footer>*/}
                        {/*<RaisedButton icon={<FontIcon className="pe-7s-close-circle" />} primary={true} label="Cancel"*/}
                                      {/*onClick={this.closeModal}/>&nbsp;&nbsp;*/}
                        {/*<RaisedButton icon={<FontIcon className="pe-7s-like2" />} primary={true} label={this.state.modalButton}*/}
                                      {/*onClick={this.handleSubmit}/>*/}
                    {/*</Modal.Footer>*/}
                {/*</Modal>*/}
            </div>
        )
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
        console.log(this.state.selectedStudents);
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
}

export default StudentViewer;