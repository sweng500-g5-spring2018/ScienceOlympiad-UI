import React, {Component} from 'react';
import {Grid, Col, Row, Button, Modal, Table} from 'react-bootstrap';
import Loader from 'react-loader'
import HttpRequest from "../../adapters/httpRequest";
import constants from "../../utils/constants";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import AppBar from 'material-ui/AppBar'
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import Card from '../../components/Card/Card.js';
import InputMask from 'react-input-mask'
import ReactTable from 'react-table'
import "react-table/react-table.css";
import matchSorter from 'match-sorter'

class Schools extends Component {
    constructor(props) {
        super(props);
        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);

        this.state = {
            loading: false,
            modal: false,
            schoolName: '',
            schoolContactPhone: '',
            schoolContactName:'',
            schoolNameRequired: '',
            schoolContactPhoneRequired: '',
            schoolContactNameRequired:'',
            schoolList:{}
        };
    }

    // Open the modal
    openModal() {
        this.setState({
            modal: true,
            schoolContactName: '',
            schoolContactPhone: '',
            schoolName: '',
            schoolNameRequired: '',
            schoolContactPhoneRequired: '',
            schoolContactNameRequired:''
        })
    }

    // Close the modal
    closeModal() {
        this.setState({
            modal: false
        })
    }

    // Check inputs and add a new school
    addNewSchool = () => {

        var blankInputs = false;
        var schoolName = this.state.schoolName.trim();
        var schoolContactName = this.state.schoolContactName.trim();
        var schoolContactPhone = this.state.schoolContactPhone.trim();

        // Checks first name
        if (schoolName) {
            this.setState({schoolNameRequired: undefined})
        }
        else {
            this.setState({schoolNameRequired: "School name is required"})
            blankInputs = true;
        }

        // Checks contact name
        if (schoolContactName) {
            this.setState({schoolContactNameRequired: undefined})
        }
        else {
            this.setState({schoolContactNameRequired: "School contact name is required"})
            blankInputs = true;
        }

        // Checks first name
        if (schoolContactPhone) {
            this.setState({schoolContactPhoneRequired: undefined})
        }
        else {
            this.setState({schoolContactPhoneRequired: "School phone number is required."})
            blankInputs = true;
        }

        // If no information is missing we can add the school
        if (!blankInputs)
        {
            var _this = this;
            var body = {};

            var cleanPhoneNumber = this.state.schoolContactPhone.trim();
            cleanPhoneNumber = cleanPhoneNumber.replace(/\s/g, '');         // Remove spaces
            cleanPhoneNumber = cleanPhoneNumber.replace(/\(|\)/g,'');       // Remove ( and )
            cleanPhoneNumber = cleanPhoneNumber.replace(/-/g,"");           // Remove -

            body.schoolName = this.state.schoolName.trim();
            body.schoolContactName = this.state.schoolContactName.trim();
            body.schoolContactPhone = cleanPhoneNumber;

            _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + '/sweng500/addSchool', 'POST', null, body ).then(function (result) {
                console.log(result);

                if (result.status === 200){

                    // Close the modal and show a success message
                    _this.setState({
                        modal: false,
                    })

                    _this.componentDidMount();

                }

            }).catch(function (error) {
                console.log(error);

                // Close the modal and show a failed message
                _this.setState({modal: false})

            })
        }
    }

    // Fetch a list of schools
    componentDidMount() {
        //Make call out to backend
        var _this = this;

        _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + '/sweng500/getSchools', 'GET', null, null).then(function (result) {
            console.log(result);
            _this.setState({
                schoolList: result.body,
                loading: true
            })

        }).catch(function (error) {
            console.log(error);
        })
    }

    // Reformat the phone number
    formatPhoneNumber(str)
    {
        var part1 = str.substr(1, 3)
        var part2 = str.substr(4, 3)
        var part3 = str.substr(7, 4)

        return("(" + part1 + ") " + part2 + "-" + part3)
    }

    // Generate the table if the fetch was successful
    renderIfSchoolsFound() {
        if (this.state.schoolList !== null && Object.keys(this.state.schoolList).length !== 0) {
            const columns = [{
                Header: 'School Name',
                filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, { keys: ["schoolName"] }),
                filterAll: true,
                accessor: 'schoolName' // String-based value accessors!
            }, {
                Header: 'School Contact',
                filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, { keys: ["schoolContactName"] }),
                filterAll: true,
                accessor: 'schoolContactName' // String-based value accessors!
            }, {
                Header: 'School Phone Number',
                filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, { keys: ["schoolContactPhone"] }),
                filterAll: true,
                accessor: 'schoolContactPhone' // String-based value accessors!
            }, {
                Header: 'Actions',
                accessor: 'menuActions', // String-based value accessors!
                style:{textAlign:'center'},
                sortable: false,
                filterable: false
            }];

            for(let value in this.state.schoolList) {
                this.state.schoolList[value].schoolContactPhone = this.formatPhoneNumber(this.state.schoolList[value].schoolContactPhone);
                this.state.schoolList[value].menuActions = <div><a href=''>Edit</a>&nbsp;&nbsp;&nbsp;<a href=''>Delete</a></div>;
            }

            return(
                <ReactTable
                    data={this.state.schoolList}
                    filterable
                    defaultFilterMethod={(filter, row) =>
                        String(row[filter.id]) === filter.value}
                    columns={columns}
                    defaultPageSize={10}
                    className="-striped -highlight"
                    defaultSorted={[{id: "schoolName"}]}
                />
            )

        }
        else
            return("Error loading school list.")
    }

    render() {
        return (
            <MuiThemeProvider>
            <div className="content">
                <Grid fluid>
                    <Row>
                        <Col md={12} style={{textAlign:'center',marginBottom:10}}>
                                <RaisedButton primary={true} label="Create a new school" onClick={this.openModal}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <Card
                                title="Registered Schools"
                                category="These schools are registered with the Science Olympiad system. They will appear in the registration systems and reports."
                                ctTableFullWidth ctTableResponsive
                                content={
                                    <Loader color="#3498db" loaded={this.state.loading}>
                                        {this.renderIfSchoolsFound()}
                                    </Loader>
                                }
                            />
                        </Col>
                    </Row>
                </Grid>
                <Modal show={this.state.modal} onHide={this.closeModal}>
                    <Modal.Header>
                        <Modal.Title> <AppBar
                            iconElementRight={<FlatButton label="Close"/>}
                            showMenuIconButton={false}
                            onRightIconButtonClick={(event) => this.closeModal()}
                            title="Create New School"
                        /></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <TextField
                            id={"schoolName"}
                            floatingLabelText="School Name"
                            onChange={(event, newValue) => this.setState({schoolName: newValue})}
                            value={this.state.schoolName}
                            required={true}
                            autoFocus={true}
                            fullWidth={true}
                            hintText="Enter a name for the school"
                            errorText={this.state.schoolNameRequired}
                        />
                        <br/>
                        <TextField
                            id={"schoolContactName"}
                            floatingLabelText="Contact Name"
                            onChange={(event, newValue) => this.setState({schoolContactName: newValue})}
                            value={this.state.schoolContactName}
                            required={true}
                            fullWidth={true}
                            hintText="Enter a first and last name for the school contact"
                            errorText={this.state.schoolContactNameRequired}
                        />
                        <br/>
                        <TextField
                            id={"schoolContactPhone"}
                            floatingLabelText="Phone Number"
                            onChange={(event, newValue) => this.setState({schoolContactPhone: newValue})}
                            value={this.state.schoolContactPhone}
                            required={true}
                            fullWidth={true}
                            hintText="Enter the school's phone numer"
                            errorText={this.state.schoolContactPhoneRequired}
                        >
                            <InputMask mask="1 (999) 999-9999" maskChar="#" value={this.state.schoolContactPhone}/>
                        </TextField>
                    </Modal.Body>
                    <Modal.Footer>
                        <RaisedButton icon={<FontIcon className="pe-7s-like2" />} primary={true} label="Add School"
                                      onClick={this.addNewSchool}/>;
                    </Modal.Footer>
                </Modal>
            </div>
            </MuiThemeProvider>
        );
    }
}

export default Schools;
