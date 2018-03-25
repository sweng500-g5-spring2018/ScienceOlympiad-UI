import React, {Component} from 'react';
import {MuiThemeProvider, Dialog, Popover, Menu, MenuItem, RaisedButton, AppBar, FlatButton} from 'material-ui';
import Button from '../../elements/CustomButton/CustomButton';
import {Grid, Row, Col, Panel, PanelGroup, Modal, ModalBody, ModalFooter, ModalHeader} from 'react-bootstrap';
import FontIcon from 'material-ui/FontIcon';

import ReactTable from 'react-table';
import StudentAdder from "../../components/Students/StudentAdder";
import TeamAdder from "../../components/Teams/TeamAdder";
import constants from "../../utils/constants";
import HttpRequest from "../../adapters/httpRequest";
import matchSorter from "match-sorter";
import StudentViewer from "./StudentViewer";

class TeamViewer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            teams: []
        }

        this.addStudentToTeam = this.addStudentToTeam.bind(this);
    }

    componentWillMount() {
        var _this = this;

        _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + '/sweng500/getTeams', 'GET', constants.useCredentials(), null, true).then(function (result) {
            console.log(result.body);
            let resultTeams = result.body;

            for(let value in resultTeams) {
                resultTeams[value].menuActions = <div><RaisedButton
                    primary={true} onClick={event => {}} label="Edit"/>&nbsp;&nbsp;&nbsp;<RaisedButton
                    secondary={true} onClick={event => {}} label="Delete"/></div>;

                resultTeams[value].students.push({
                    emailAddress: "bullshit@bullshit.com",
                    firstName: "bull",
                    lastName: "shit",
                    id: "123456789098765432112345",
                    name: "bull shit",
                    phoneNumber: "",
                    school: {schoolName: "Dallas Dag"}
                });
            }

            _this.setState({teams: resultTeams})
        }).catch(function (error) {
            console.log(error);
        })
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

    // render() {
    //     return (
    //         <div><div>HELLLOOOOO</div>{Object.keys(this.state.teams).map(function (teamKey) {
    //             return <div>{this.state.teams[teamKey].name}</div>
    //         }, this)}</div>
    //     )
    // }


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
                matchSorter(rows, filter.value, {keys: ["coach"]}),
            filterAll: true,
            accessor: 'coach.name' // String-based value accessors!
        }, {
            Header: 'School',
            filterMethod: (filter, rows) =>
                matchSorter(rows, filter.value, {keys: ["coach"]}),
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
                    defaultPageSize={5}
                    className="-striped -highlight"
                    defaultSorted={[{id: "name"}]}
                    SubComponent={row => (
                        <StudentViewer teamProp={row.original}/>
                    )}
                />
            </div>
        )
    }

}

export default TeamViewer;