import React, {Component} from 'react';
import {MuiThemeProvider, Dialog, Popover, Menu, MenuItem, RaisedButton, AppBar, FlatButton, SelectField} from 'material-ui';
import Button from '../../elements/CustomButton/CustomButton';
import {Grid, Row, Col, Panel, PanelGroup, Modal, ModalBody, ModalFooter, ModalHeader} from 'react-bootstrap';
import FontIcon from 'material-ui/FontIcon';

import ReactTable from 'react-table';
import StudentAdder from "../../components/Students/StudentAdder";
import TeamAdder from "../../components/Teams/TeamAdder";
import constants from "../../utils/constants";
import HttpRequest from "../../adapters/httpRequest";
import matchSorter from "match-sorter";

class StudentViewer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modal: false,
            modalTitle: "",
            teams: [],
            studentsSelectable: []
        }

        this.closeModal = this.closeModal.bind(this);
        this.addStudentToTeam = this.addStudentToTeam.bind(this);
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

    handleSubmit() {
        console.log("SUBMIT CLICKED");
    }

    addStudentToTeam(studentId, teamId) {
        var body = {};
        body.studentId = this.state.firstName;
        body.teamId = this.state.lastName;

        var _this = this;

        _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + '/sweng500/addStudentToTeam', 'POST', constants.useCredentials(), body, true).then(function (result) {
            alert(result.body);
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
            _this.setState({
                modalTitle: "Add Student to Team",
                modalButton: "Submit",
                studentsSelectable: students,
                modal: true
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
                        <Button fill bsStyle="info" onClick={event => {this.clickAddStudentToTeam(this.props.teamProp)}}>Add Student to <b>{this.props.teamProp.name}</b></Button>
                    </div>
                </div>
                <Modal show={this.state.modal} onHide={this.closeModal}>
                    <Modal.Header>
                        <Modal.Title> <AppBar
                            iconElementRight={<FlatButton label="Close"/>}
                            showMenuIconButton={false}
                            onRightIconButtonClick={(event) => this.closeModal()}
                            title={this.state.modalTitle}
                        /></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            {
                                Object.keys(this.state.studentsSelectable).map(function (studentKey) {
                                    return <li>{this.state.studentsSelectable[studentKey].name}</li>
                                }, this)
                            }
                            {/*<SelectField*/}
                                {/*multiple={true}*/}
                                {/*fullWidth={true}*/}
                                {/*autoWidth={true}*/}
                                {/*hintText="Students In District"*/}
                                {/*value={this.state.studentSelectValues}*/}
                                {/*onChange={this.studentMenuClick}*/}
                            {/*>*/}
                                {/*{this.judgeMenuItems(this.state.studentSelectValues)}*/}
                            {/*</SelectField>*/}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <RaisedButton icon={<FontIcon className="pe-7s-close-circle" />} primary={true} label="Cancel"
                                      onClick={this.closeModal}/>&nbsp;&nbsp;
                        <RaisedButton icon={<FontIcon className="pe-7s-like2" />} primary={true} label={this.state.modalButton}
                                      onClick={this.handleSubmit}/>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }

    // //adds in the menu items for existing judges
    // studentMenuItems = (studentMenuItems) => {
    //     if (this.state.studentMenuItems != null) {
    //         return this.state.studentSelectValues.map((obj) => (
    //             <MenuItem
    //                 key={obj.id}
    //                 insetChildren={true}
    //                 targetOrigin={{horizontal: "right", vertical: "bottom"}}
    //                 checked={existingJudgeValues && existingJudgeValues.indexOf(obj.id) > -1}
    //                 value={obj.id}
    //                 primaryText={obj.firstName + "     " + obj.lastName + "  --   " + obj.emailAddress}
    //             />
    //         ));
    //     }
    // }
    //
    // studentMenuClick = (event, index, values) => {
    //     this.setState({
    //         studentSelectValues: values
    //     });
    // }

}

export default StudentViewer;