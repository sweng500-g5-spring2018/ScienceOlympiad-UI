import React, {Component} from 'react';
import {Grid, Col, Row, Modal} from 'react-bootstrap';
import Loader from 'react-loader'
import HttpRequest from "../../adapters/httpRequest";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import Card from '../../components/Card/Card.js';
import InputMask from 'react-input-mask';
import ReactTable from 'react-table';
import matchSorter from 'match-sorter';
import Dialog from 'material-ui/Dialog';
import constants from "../../utils/constants";
import NotificationSystem from 'react-notification-system';
import {style} from "../../variables/Variables";


class Schools extends Component {
    constructor(props) {
        super(props);
        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
        this.addNotification = this.addNotification.bind(this);

        this.state = {
            loading: false,
            modal: false,
            modalTitle: '',
            modalAction: '',
            modalButton: '',
            editModal: false,
            confirmDialog: false,
            confirmMessage: '',
            formattedPhone: '',
            deleteID: '',
            schoolID: '',
            schoolName: '',
            schoolContactPhone: '',
            schoolContactName:'',
            schoolNameRequired: '',
            schoolContactPhoneRequired: '',
            schoolContactNameRequired:'',
            schoolList:[],
            _notificationSystem: null

        };
    }

    addNotification(message, level, position, autoDismiss, optionalTitle){
        this.state._notificationSystem.addNotification({
            title: optionalTitle ? optionalTitle : (<span data-notify="icon" className="pe-7s-home"></span>),
            message: (
                <div>
                    {message}
                </div>
            ),
            level: level ? level : 'info',
            position: position ? position : 'tc',
            autoDismiss: autoDismiss ? autoDismiss : 10,
        });
    }

    // Open the modal
    openModal = (mode) => {

        if (mode.status === "add")
        {
            this.setState({
                modal: true,
                modalAction: 'add',
                modalTitle: "Add New School",
                modalButton: "Add School",
                schoolContactName: '',
                schoolContactPhone: '',
                schoolName: '',
                schoolNameRequired: '',
                schoolContactPhoneRequired: '',
                schoolContactNameRequired:''
            })
        }
        else if (mode.status === "edit")
        {
            this.setState({
                modal: true,
                modalAction: 'edit',
                modalTitle: "Edit School",
                modalButton: "Update School",
                schoolContactName: mode.schoolContactName,
                schoolContactPhone: mode.schoolContactPhone,
                schoolName: mode.schoolName,
                schoolID: mode.id,
                schoolNameRequired: '',
                schoolContactPhoneRequired: '',
                schoolContactNameRequired:''
            })
        }
    }

    // Close the modal
    closeModal() {
        this.setState({
            modal: false
        })
    }

    // Delete school
    confirmSchoolDelete = (s) => {
        this.setState({deleteID: s.id});
        this.setState({confirmMessage: "Are you sure you want to delete " + s.schoolName + "?", confirmDialog: true});
    }

    closeConfirmDialog  = () => {
        this.setState({confirmDialog: false});
    }

    deleteSchool =()=> {

        var id = this.state.deleteID;
        var _this = this;

        _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + '/sweng500/removeSchool/' + id, 'DELETE', constants.useCredentials(), null).then(function (result) {
            console.log(result);

            _this.setState({confirmDialog: false});

            if (result.status === 200) {

                _this.addNotification(
                    "Success: The school has been deleted.",
                    "info",
                    "tc",
                    6
                );

                _this.componentDidMount();
            }

        }).catch(function (error) {
            console.log(error);

            _this.addNotification(
                "Error: The school has not been deleted.",
                "error",
                "tc",
                6
            );


            _this.setState({confirmDialog: false});
        })
    }

    // Check inputs and add a new school
    handleSubmit = () => {

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
            cleanPhoneNumber = cleanPhoneNumber.replace(/\(|\)/g, '');       // Remove ( and )
            cleanPhoneNumber = cleanPhoneNumber.replace(/-/g, "");           // Remove -

            body.schoolName = this.state.schoolName.trim();
            body.schoolContactName = this.state.schoolContactName.trim();
            body.schoolContactPhone = cleanPhoneNumber;

            if (this.state.modalAction === "add") {

                _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + '/sweng500/addSchool', 'POST', constants.useCredentials(), body).then(function (result) {
                    console.log(result);

                    if (result.status === 200) {

                        // Post a notification
                        _this.addNotification(
                            "Success: The school has been added.",
                            "info",
                            "tc",
                            6
                        );

                        // Close the modal and show a success message
                        _this.setState({modal: false})

                        // Update the component
                        _this.componentDidMount();

                    }

                }).catch(function (error) {
                    console.log(error);

                    _this.addNotification(
                        "Error: The school has not been added.",
                        "error",
                        "tc",
                        6
                    );

                    // Close the modal and show a failed message
                    _this.setState({modal: false})

                })
            }
            else if (this.state.modalAction === "edit")
            {
                console.log(this.state.schoolID);

                _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + '/sweng500/updateSchool/'+ this.state.schoolID, 'POST', constants.useCredentials(), body).then(function (result) {
                    console.log(result);

                    if (result.status === 200) {

                        // Close the modal and show a success message
                        _this.setState({
                            modal: false,
                        })

                        _this.addNotification(
                            "Success: The school has been updated.",
                            "info",
                            "tc",
                            6
                        );

                        _this.componentDidMount();

                    }

                }).catch(function (error) {
                    console.log(error);

                    _this.addNotification(
                        "Error: The school has not been updated.",
                        "error",
                        "tc",
                        6
                    );

                    // Close the modal and show a failed message
                    _this.setState({modal: false})

                })
            }
        }
    }

    // Fetch a list of schools
    componentWillMount() {
        this.setState({_notificationSystem: this.refs.notificationSystem});

        //Make call out to backend
        var _this = this;

        _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + '/sweng500/getSchools', 'GET', constants.useCredentials(), null).then(function (result) {
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
                accessor: 'formattedPhone' // String-based value accessors!
            }, {
                Header: 'Actions',
                accessor: 'menuActions', // String-based value accessors!
                style:{textAlign:'center'},
                sortable: false,
                filterable: false
            }];

            for(let value in this.state.schoolList) {
                this.state.schoolList[value].formattedPhone = this.formatPhoneNumber(this.state.schoolList[value].schoolContactPhone);
                this.state.schoolList[value].status = "edit";
                this.state.schoolList[value].menuActions = <div><a style={{cursor:'pointer'}} onClick={this.openModal.bind(this,this.state.schoolList[value])}>Edit</a>&nbsp;&nbsp;&nbsp;<a style={{cursor:'pointer'}} onClick={this.confirmSchoolDelete.bind(this,this.state.schoolList[value])}>Delete</a></div>;
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
            return("ERROR LOADING SCHOOLS")
    }

    render() {

        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onClick={this.closeConfirmDialog}
            />,
            <FlatButton
                label="Delete"
                primary={true}
                onClick={this.deleteSchool}
            />,
        ];
        var status = {"status" : "add"};
        return (
            <MuiThemeProvider>
                <div className="content">
                    <NotificationSystem ref="notificationSystem" style={style}/>
                    <Grid fluid>
                    <Row>
                        <Col md={12}>
                            <Card
                                title="Registered Schools"
                                category={
                                    <div>These schools are registered with the Science Olympiad system.<br/>They will appear in the registration systems and reports.
                                        <br/><br/>
                                    <RaisedButton primary={true} label="Create a new school" onClick={this.openModal.bind(this,status)}/>
                                    </div>}
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
                            title={this.state.modalTitle}
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
                        <RaisedButton icon={<FontIcon className="pe-7s-close-circle" />} primary={true} label="Cancel"
                                      onClick={this.closeModal}/>&nbsp;&nbsp;
                        <RaisedButton icon={<FontIcon className="pe-7s-like2" />} primary={true} label={this.state.modalButton}
                                      onClick={this.handleSubmit}/>
                    </Modal.Footer>
                </Modal>
                <Dialog
                    actions={actions}
                    modal={false}
                    open={this.state.confirmDialog}
                    onRequestClose={this.closeConfirmDialog}
                >
                    {this.state.confirmMessage}
                </Dialog>
            </div>
            </MuiThemeProvider>
        );
    }
}

export default Schools;
