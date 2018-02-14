import React, {Component} from 'react';
import {Grid, Row, Button, Table} from 'react-bootstrap';
import Loader from 'react-loader'
import HttpRequest from "../../adapters/httpRequest";
import constants from "../../utils/constants";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';

class Events extends Component {
    constructor(props) {
        super(props);

        this.state = {
            test: {},
            loading: false

        };
    }


    createNewEvent() {
        console.log("got here");
        alert("create");
    }

    componentDidMount() {
        //Make call out to backend
        var _this = this;

        _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() + "/sweng500/events", "get", constants.useCredentials(), null).then(function (result) {
            console.log("execute");
            _this.setState({
                test: result.body,
                loading: true
            })


        }).catch(function (error) {
            console.log(error);
        })

    }

    renderIfTestFound() {

        if (this.state.test !== null && Object.keys(this.state.test).length !== 0) {

            return (

                <div>


                    <Table striped bordered condensed hover>
                        <thead>
                        <tr>
                            <th>Event Name</th>
                            <th>Location</th>
                        </tr>
                        </thead>
                        <tbody>


                        {


                            Object.keys(this.state.test).map(function (key) {
                                //if(key === 'name' || key === 'id') {
                                return (
                                    <tr>
                                        <td>{this.state.test[key].name} </td>
                                        <td>TBD</td>
                                    </tr>
                                )
                                // }
                            }, this)

                        }

                        </tbody>
                    </Table>

                </div>
            )
        } else {
            <h1>Not Found</h1>
        }
    }

    render() {
        return (

            <div className="content">
                <div key="notFound-key" className="notFoundClass">
                    <MuiThemeProvider>
                        <RaisedButton primary={true} label="Create New Event" onClick={this.createNewEvent}/>
                    <br/>
                    <Loader color="#3498db" loaded={this.state.loading}>

                        {this.renderIfTestFound()}
                    </Loader>
                    </MuiThemeProvider>

                </div>
            </div>
        );
    }
}

export default Events;
