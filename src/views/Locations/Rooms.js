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
import Card from '../../components/Cards/Card.js';
import ReactTable from 'react-table';
import matchSorter from 'match-sorter';
import Dialog from 'material-ui/Dialog';
import constants from "../../utils/constants";
import NotificationSystem from 'react-notification-system';
import {style} from "../../variables/Variables";
import BuildingSelector from '../../components/Buildings/BuildingSelector';


class Rooms extends Component {
    constructor(props) {
        super(props);
        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
        this.addNotification = this.addNotification.bind(this);
        this.buildingCallback = this.buildingCallback.bind(this);

        this.state = {
            loading: false,
            modal: false,
            modalTitle: '',
            modalAction: '',
            modalButton: '',
            editModal: false,
            confirmDialog: false,
            confirmMessage: '',
            roomName: '',
            building: null,
            buildingRequired: null,
            roomCapacity: null,
            buildingError: null,
            deleteID: '',
            roomID: '',
            roomCapacityRequired:'',
            roomList:[],
            buildingList:[],
            _notificationSystem: null
        };
    }

    addNotification(message, level, position, autoDismiss, optionalTitle){
        this.state._notificationSystem.addNotification({
            title: optionalTitle ? optionalTitle : (<span data-notify="icon" className="pe-7s-ribbon"></span>),
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

    buildingCallback(event, index, value) {

        this.setState({
            building: value});
    }

    // Open the modal
    openModal = (mode) => {

        if (mode.status === "add")
        {
            this.setState({
                modal: true,
                modalAction: 'add',
                modalTitle: "Add New Room",
                modalButton: "Add Room",
                roomCapacity: '',
                roomName: '',
                roomNameRequired: '',
                roomCapacityRequired:'',
                building: '',
                buildingRequired: ''
            })
        }
        else if (mode.status === "edit")
        {
            this.setState({
                modal: true,
                modalAction: 'edit',
                modalTitle: "Edit Room",
                modalButton: "Update Room",
                roomCapacity: mode.capacity,
                roomName: mode.roomName,
                building: mode.buildingID,
                roomID: mode.id,
                roomNameRequired: '',
                roomCapacityRequired:''
            })
        }
    }

    // Close the modal
    closeModal() {
        this.setState({
            modal: false
        })
    }

    // Delete room
    confirmRoomDelete = (s) => {
        this.setState({deleteID: s.id});
        this.setState({confirmMessage: "Are you sure you want to delete " + s.roomName + "?", confirmDialog: true});
    }

    getBuildingName(id)
    {

        for(let value in this.state.buildingList) {

            if (this.state.buildingList[value].id === id)
                return this.state.buildingList[value].building;
        }

        return "Invalid Building ID";
    }

    closeConfirmDialog  = () => {
        this.setState({confirmDialog: false});
    }

    deleteRoom =()=> {

        var id = this.state.deleteID;
        var _this = this;

        _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + '/sweng500/removeRoom/' + id, 'DELETE', constants.useCredentials(), null).then(function (result) {

            _this.setState({confirmDialog: false});
            _this.addNotification(
                "Success: The room has been deleted.",
                "info",
                "tc",
                6
            );

            _this.componentDidMount();

        }).catch(function (error) {

            _this.addNotification(
                "Error: The room has not been deleted.",
                "error",
                "tc",
                6
            );


            _this.setState({confirmDialog: false});
        })
    }

    // Check inputs and add a new room
    handleSubmit = () => {

        var blankInputs = false;
        var roomName = this.state.roomName.trim();
        var roomCapacity = this.state.roomCapacity;
        var buildingID = this.state.building;

        // Checks first name
        if (roomName) {
            this.setState({roomNameRequired: undefined})
        }
        else {
            this.setState({roomNameRequired: "A room name or number is required"})
            blankInputs = true;
        }

        // Checks contact name
        if (roomCapacity) {
            this.setState({roomCapacityRequired: undefined})
        }
        else {
            this.setState({roomCapacityRequired: "A room capacity is required"})
            blankInputs = true;
        }

        // Checks for a building
        if (buildingID) {
            this.setState({buildingRequired: undefined})
        }
        else {
            this.setState({buildingRequired: "A building is required"})
            blankInputs = true;
        }

        // If no information is missing we can add the room
        if (!blankInputs)
        {

            var _this = this;

            var body = {};

            body.roomName = this.state.roomName.trim();
            body.capacity = this.state.roomCapacity;
            body.buildingID = this.state.building;

            if (this.state.modalAction === "add") {

                _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + '/sweng500/addRoom', 'POST', constants.useCredentials(), body).then(function (result) {

                    if (result.status === 200) {

                        // Post a notification
                        _this.addNotification(
                            "Success: The room has been added.",
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

                    _this.addNotification(
                        "Error: The room has not been added.",
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
                _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + '/sweng500/updateRoom/'+ this.state.roomID, 'POST', constants.useCredentials(), body).then(function (result) {

                    if (result.status === 200) {

                        // Close the modal and show a success message
                        _this.setState({
                            modal: false,
                        })

                        _this.addNotification(
                            "Success: The room has been updated.",
                            "info",
                            "tc",
                            6
                        );

                        _this.componentDidMount();

                    }

                }).catch(function (error) {

                    _this.addNotification(
                        "Error: The room has not been updated.",
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

    // Fetch a list of rooms
    componentDidMount() {
        this.setState({_notificationSystem: this.refs.notificationSystem});

        //Make call out to backend to get a list of rooms
        var _this = this;

        _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + '/sweng500/getAllRooms', 'GET', constants.useCredentials(), null).then(function (result) {
            _this.setState({
                roomList: result.body,
                loading: true
            })

        }).catch(function (error) {
        })

        //Make call out to backend to get a list of buildings
        _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + '/sweng500/getBuildings', 'GET', constants.useCredentials(), null, true).then(function (result) {

            _this.setState({
                buildingList: result.body,
                loading: true
            })

        }).catch(function (error) {
            console.log(error);
        })


    }

    // Generate the table if the fetch was successful
    renderIfRoomsFound() {
        if (this.state.roomList !== null && Object.keys(this.state.roomList).length !== 0) {

            var tempList = this.state.roomList;

            for(let value in tempList) {

                tempList[value].status = "edit";
                tempList[value].buildingName = this.getBuildingName(this.state.roomList[value].buildingID);
                tempList[value].menuActions = <div><RaisedButton
                    primary={true} onClick={this.openModal.bind(this,this.state.roomList[value])} label="Edit"/>&nbsp;&nbsp;&nbsp;<RaisedButton
                    secondary={true} onClick={this.confirmRoomDelete.bind(this,this.state.roomList[value])} label="Delete"/></div>;
            }

            return(
                <ReactTable
                    data={tempList}
                    filterable
                    defaultFilterMethod={(filter, row) =>
                        String(row[filter.id]) === filter.value}
                    columns={this.columns}
                    defaultPageSize={10}
                    className="-striped -highlight"
                    defaultSorted={[{id: "roomName"}]}
                />
            )

        }
        else
            return("ERROR LOADING ROOMS")
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
                onClick={this.deleteRoom}
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
                                        style={{margin:10}}
                                        title="Registered Rooms"
                                        category={
                                            <div>These rooms are registered with the Science Olympiad system.<br/>They are assigned to an existing building.
                                                <br/><br/>
                                                <RaisedButton primary={true} label="Create a new room" onClick={this.openModal.bind(this,status)}/>
                                            </div>}
                                        ctTableFullWidth ctTableResponsive
                                        content={
                                    <Loader color="#3498db" loaded={this.state.loading}>
                                        {this.renderIfRoomsFound()}
                                    </Loader>
                                    }/>
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
                                id={"roomName"}
                                floatingLabelText="Room Name or Number"
                                onChange={(event, newValue) => this.setState({roomName: newValue})}
                                value={this.state.roomName}
                                required={true}
                                autoFocus={true}
                                fullWidth={true}
                                hintText="Enter a room name or number"
                                errorText={this.state.roomNameRequired}
                            />
                            <br/>
                            <TextField
                                id={"roomCapacity"}
                                floatingLabelText="Room Capacity"
                                onChange={(event, newValue) => this.setState({roomCapacity: newValue})}
                                value={this.state.roomCapacity}
                                required={true}
                                fullWidth={true}
                                hintText="Enter the room's capacity"
                                errorText={this.state.roomCapacityRequired}
                            />
                            <br/>
                            <BuildingSelector selected={this.state.building}
                                              errorMsg={this.state.buildingRequired}
                                              callBack={this.buildingCallback}
                                              labelText={"Building"}
                                              hintText={"Select a building"}/>
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

    columns = [{
        Header: 'Room Name or Number',
        filterMethod: (filter, rows) =>
            matchSorter(rows, filter.value, { keys: ["roomName"] }),
        filterAll: true,
        accessor: 'roomName' // String-based value accessors!
    }, {
        Header: 'Building Name',
        filterMethod: (filter, rows) =>
            matchSorter(rows, filter.value, { keys: ["buildingName"] }),
        filterAll: true,
        accessor: 'buildingName' // String-based value accessors!
    }, {
        Header: 'Room Capacity',
        filterMethod: (filter, rows) =>
            matchSorter(rows, filter.value, { keys: ["capacity"] }),
        filterAll: true,
        accessor: 'capacity' // String-based value accessors!
    }, {
        Header: 'Actions',
        accessor: 'menuActions', // String-based value accessors!
        style:{textAlign:'center'},
        sortable: false,
        filterable: false
    }];
}

export default Rooms;
