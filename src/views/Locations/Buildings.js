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
import {Map, Marker, GoogleApiWrapper} from 'google-maps-react';


class Buildings extends Component {
    constructor(props) {
        super(props);

        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
        this.addNotification = this.addNotification.bind(this);

        this.divStyle = {
            height: '300px',
            width: '450px',
            position: 'relative',
            overflow: 'scroll'
        };

        this.state = {
            loading: false,
            modal: false,
            modalTitle: '',
            modalAction: '',
            modalButton: '',
            editModal: false,
            confirmDialog: false,
            confirmMessage: '',
            deleteID: '',
            buildingID: '',
            building: '',
            longitude: null,
            latitude: null,
            buildingRequired: '',
            buildingList:{},
            _notificationSystem: null
        };
    }

    // When the map is clicked record the latitude and longitude
    onMapClicked = (mapProps, map, event) => {

        this.setState({
            latitude: event.latLng.lat(),
            longitude: event.latLng.lng()
        });
    }

    // If there is a latiude and longitude then display it
    addMarker = () => {
        if (this.state.latitude !== undefined)
            return(<Marker name={'Current location'} position={{lat: this.state.latitude, lng: this.state.longitude}}/>);
    }

    // Display notification
    addNotification(message, level, position, autoDismiss, optionalTitle){
        this.state._notificationSystem.addNotification({
            title: optionalTitle ? optionalTitle : (<span data-notify="icon" className="pe-7s-map"></span>),
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

        // Change from add to edit mode
        if (mode.status === "add")
        {
            this.setState({
                modal: true,
                modalAction: 'add',
                modalTitle: "Add Building",
                modalButton: "Add Building",
                latitude: null,
                longitude: null,
                building: '',
                buildingRequired: '',
                markerRequired: '',
            })
        }
        else if (mode.status === "edit")
        {
            this.setState({
                modal: true,
                modalAction: 'edit',
                modalTitle: "Edit Building",
                modalButton: "Update Building",
                latitude: mode.lat,
                longitude: mode.lng,
                building: mode.building,
                buildingID: mode.id,
                buildingRequired: '',
                markerRequired: '',
            })

            this.addMarker();
        }
    }

    // Close the modal
    closeModal() {
        this.setState({
            modal: false
        })
    }

    // Confrim Delete building
    confirmBuildingDelete = (s) => {
        this.setState({deleteID: s.id});
        this.setState({confirmMessage: "Are you sure you want to delete " + s.building + "?", confirmDialog: true});
    }

    // Close the confirm dialog
    closeConfirmDialog  = () => {
        this.setState({confirmDialog: false});
    }

    // Remove the building
    deleteBuilding =()=> {

        var id = this.state.deleteID;
        var _this = this;


        console.log(constants.useCredentials())

        _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + '/sweng500/removeBuilding/' + id, 'DELETE', constants.useCredentials(), null, true).then(function (result) {
            console.log(result);

            _this.setState({confirmDialog: false});

            if (result.status === 200) {

                _this.addNotification(
                    "Success: The building has been deleted.",
                    "info",
                    "tc",
                    6
                );

                _this.componentDidMount();
            }

        }).catch(function (error) {
            console.log(error);

            _this.addNotification(
                "Error: The building has not been deleted.",
                "error",
                "tc",
                6
            );


            _this.setState({confirmDialog: false});
        })
    }

    // Check inputs and adds a new building
    handleSubmit = () => {

        var blankInputs = false;
        var building = this.state.building.trim();
        var lat = this.state.latitude;
        var lng = this.state.longitude;

        // Checks first name
        if (building) {
            this.setState({buildingRequired: undefined})
        }
        else {
            this.setState({buildingRequired: "A building name is required"})
            blankInputs = true;
        }

        // Checks first name
        if (lat !== null && lng !== null) {
            this.setState({markerRequired: undefined})
        }
        else {
            this.setState({markerRequired: "You must identify the building by placing a marker on the map."})
            blankInputs = true;
        }

        // If no information is missing we can add the building
        if (!blankInputs)
        {

            var _this = this;

            var body = {};

            body.building = building;
            body.lat = lat;
            body.lng = lng;

            console.log(body);

            if (this.state.modalAction === "add") {

                _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + '/sweng500/addBuilding', 'POST', constants.useCredentials(), body, true).then(function (result) {
                    console.log(result);

                    if (result.status === 200) {

                        // Post a notification
                        _this.addNotification(
                            "Success: The building has been added.",
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
                        "Error: The building has not been added.",
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
                console.log(this.state.buildingID);

                _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + '/sweng500/updateBuilding/'+ this.state.buildingID, 'POST', constants.useCredentials(), body, true).then(function (result) {
                    console.log(result);

                    if (result.status === 200) {

                        // Close the modal and show a success message
                        _this.setState({
                            modal: false,
                        })

                        _this.addNotification(
                            "Success: The building has been updated.",
                            "info",
                            "tc",
                            6
                        );

                        _this.componentDidMount();

                    }

                }).catch(function (error) {
                    console.log(error);

                    _this.addNotification(
                        "Error: The building has not been updated.",
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

    // Fetch a list of buildings
    componentDidMount() {
        this.setState({_notificationSystem: this.refs.notificationSystem});

        //Make call out to backend
        var _this = this;

        _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + '/sweng500/getBuildings', 'GET', constants.useCredentials(), null, true).then(function (result) {
            console.log(result);
            _this.setState({
                buildingList: result.body,
                loading: true
            })

        }).catch(function (error) {
            console.log(error);
        })
    }


    // Generate the table if the fetch was successful
    renderIfBuildingsFound() {
        if (this.state.buildingList !== null && Object.keys(this.state.buildingList).length !== 0) {

            const columns = [{
                Header: 'Building Name',
                filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, { keys: ["building"] }),
                filterAll: true,
                accessor: 'building' // String-based value accessors!
            }, {
                Header: 'Latitude',
                filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, { keys: ["latitude"] }),
                filterAll: true,
                accessor: 'lat' // String-based value accessors!
            }, {
                Header: 'Longitude',
                filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, { keys: ["longitude"] }),
                filterAll: true,
                accessor: 'lng' // String-based value accessors!
            }, {
                Header: 'Actions',
                accessor: 'menuActions', // String-based value accessors!
                style:{textAlign:'center'},
                sortable: false,
                filterable: false
            }];

            console.log(this.state.buildingList)

            for(let value in this.state.buildingList) {
                this.state.buildingList[value].status = "edit";
                this.state.buildingList[value].position = value;
                this.state.buildingList[value].menuActions = <div><RaisedButton
                    primary={true} onClick={this.openModal.bind(this,this.state.buildingList[value])} label="Edit"/>&nbsp;&nbsp;&nbsp;<RaisedButton
                    secondary={true} onClick={this.confirmBuildingDelete.bind(this,this.state.buildingList[value])} label="Delete"/></div>;
            }

            return(
                <ReactTable
                    data={this.state.buildingList}
                    filterable
                    defaultFilterMethod={(filter, row) =>
                        String(row[filter.id]) === filter.value}
                    columns={columns}
                    defaultPageSize={10}
                    className="-striped -highlight"
                    defaultSorted={[{id: "building"}]}
                />
            )

        }
        else
            return("Error loading building list.")
    }

    render() {

        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onClick={this.closeConfirmDialog}/>,
            <FlatButton
                label="Delete"
                primary={true}
                onClick={this.deleteBuilding}/>,
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
                                        title="Registered Buildings"
                                        category={
                                            <div>These locations are registered with the Science Olympiad system.<br/>They will appear in the registration systems and reports.
                                                <br/><br/>
                                                <RaisedButton primary={true} label="Add a new building" onClick={this.openModal.bind(this,status)}/>
                                            </div>}
                                        ctTableFullWidth ctTableResponsive
                                        content={
                                    <Loader color="#3498db" loaded={this.state.loading}>
                                        {this.renderIfBuildingsFound()}
                                    </Loader>
                                    }/>
                                </Col>
                            </Row>
                        </Grid>
                    <Modal show={this.state.modal} onHide={this.closeModal}>
                        <Modal.Header>
                            <Modal.Title>
                                <AppBar
                                iconElementRight={<FlatButton label="Close"/>}
                                showMenuIconButton={false}
                                onRightIconButtonClick={(event) => this.closeModal()}
                                title={this.state.modalTitle}/>
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div style={{overflow: 'auto'}}>
                                <TextField
                                    id={"buildingName"}
                                    floatingLabelText="Building Name"
                                    onChange={(event, newValue) => this.setState({building: newValue})}
                                    value={this.state.building}
                                    required={true}
                                    autoFocus={true}
                                    fullWidth={true}
                                    hintText="Enter a name for the building"
                                    errorText={this.state.buildingRequired}/>

                                <div>Click on the map to place a marker on the build's location.</div>
                                <br/>
                                {this.state.markerRequired}

                                <div id="map" style={{height:300, width:450, marginLeft: 'auto', marginRight: 'auto'}}>
                                    <Map
                                    style={this.divStyle}
                                    google={this.props.google}
                                    zoomControl={true}
                                    initialCenter={{
                                        lat: 41.306610,
                                        lng: -76.015437
                                    }}
                                    zoom={16}
                                    onClick={this.onMapClicked}
                                    clickableIcons={false}>
                                        {this.addMarker()}
                                    </Map>
                                </div>
                            </div>
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
                        onRequestClose={this.closeConfirmDialog}>
                        {this.state.confirmMessage}
                    </Dialog>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: "AIzaSyC7xiiV97LyRQd-GB9aBmiJaYFGW5DVIbM"
})(Buildings)

