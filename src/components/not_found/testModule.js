import React, { Component } from 'react';
import HttpRequest from "../../adapters/httpRequest";
import constants from "../../utils/constants";

class NotFound extends Component {

    constructor(props) {
        super(props);

        this.state = {
            test: {}
        };

    }

    /**
     * This function always runs when this component is being created.
     *  React will call the function once at that point.
     *  It may or may not finish by the time the component has mounted.
     */
    componentWillMount() {

    }

    /**
     * This function always runs when the component has finished mounting
     *  React will call the function once at that point.
     *  This will only happen once the component has finished rendering
     */
    componentDidMount() {
        //Make call out to backend
        var _this = this;
        _this.serverRequest = HttpRequest.httpRequest(constants.getServerUrl() +  "sweng500/users", "get", null, null).then(function (result) {
            _this.setState({
                test: result
            })
        }).catch(function (error) {
            console.log(error);
        })
    }

    /**
     * This function always runs when the component is being created
     *  React will call this in order to render whatever html onto the page
     *  This function will get called any time the component's state has
     *  changed.
     *
     */
    render() {
        return (
            <div key="notFound-key" className="notFoundClass">
                {this.renderIfTestFound()}
            </div>
        );
    }

    renderIfTestFound() {
        if(this.state.test !== null && Object.keys(this.state.test).length !== 0) {
            return (
                <div>
                    {
                        Object.keys(this.state.test).map(function (key) {
                            return <div key={'test-'+ key +'-key'}>
                                <h3>{key}:</h3> {this.state.test[key]}
                            </div>
                        }, this)
                    }
                </div>
            )
        } else {
            return <h1>Resource not found.</h1>
        }
    }

}
export default NotFound;