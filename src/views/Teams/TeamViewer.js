import React, {Component} from 'react';
import {MuiThemeProvider, Dialog, Popover, Menu, MenuItem, RaisedButton} from 'material-ui';
import Button from '../../elements/CustomButton/CustomButton';
import {Grid, Row, Col, Panel, PanelGroup} from 'react-bootstrap';

import ReactTable from 'react-table';
import StudentAdder from "../../components/Students/StudentAdder";
import TeamAdder from "../../components/Teams/TeamAdder";
import constants from "../../utils/constants";
import HttpRequest from "../../adapters/httpRequest";
import matchSorter from "match-sorter";

class TeamViewer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            teams: []
        }
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
            <ReactTable
                data={this.state.teams}
                columns={columns}
                filterable
                defaultFilterMethod={(filter, row) =>
                    String(row[filter.id]) === filter.value }
                defaultPageSize={5}
                className="-striped -highlight"
                defaultSorted={[{id: "name"}]}
                SubComponent={ row => {
                    return (
                        <div style={{padding:'20px'}}>
                            <div style={{textAlign: 'center', fontSize: 'large'}}>
                                <em>Students in team: <b>{row.original.name}</b></em>
                            </div>
                            <ReactTable
                                data={row.original.students}
                                columns={columns2}
                                filterable
                                defaultFilterMethod={(filter, row) =>
                                    String(row[filter.id]) === filter.value }
                                defaultPageSize={row.original.students.length}
                                showPagination={false}
                                className="-striped -highlight"
                                defaultSorted={[{id: "firstName"}]}
                            />
                        </div>
                    )
                }}
            />
        )
    }

}

export default TeamViewer;