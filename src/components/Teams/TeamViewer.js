import React, {Component} from 'react';
import {RaisedButton} from 'material-ui';
import ReactTable from 'react-table';
import constants from "../../utils/constants";
import HttpRequest from "../../adapters/httpRequest";
import matchSorter from "match-sorter";
import StudentViewer from "../Students/StudentViewer";

class TeamViewer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            teams: []
        }

        this.updateTeam = this.updateTeam.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.tableUpdateToggler != nextProps.tableUpdateToggler) {
            this.getTeams();
        }
    }

    getTeams() {
        var _this = this;

        _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + '/sweng500/getTeams', 'GET', constants.useCredentials(), null, true).then(function (result) {
            console.log(result.body);
            let resultTeams = result.body;

            for(let value in resultTeams) {
                resultTeams[value].menuActions = <div><RaisedButton
                    primary={true} onClick={event => {}} label="Edit"/>&nbsp;&nbsp;&nbsp;<RaisedButton
                    secondary={true} onClick={event => {}} label="Delete"/></div>;
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
            </div>
        )
    }

}

export default TeamViewer;