import React, { Component } from 'react';
import HttpRequest from '../../adapters/httpRequest';

import ChuckNorris from './chuckNorris';
import TestModule from './testModule';

class Contact extends Component {

    constructor(props) {
        super(props);

        this.state = {
            chuckNorris: ""
        };

        this.callChuckNorris = this.callChuckNorris.bind(this);
    }

    callChuckNorris(event) {
        event.preventDefault();

        //Make call out to get chuck norris joke
        var _this = this;
        _this.serverRequest = HttpRequest.httpRequest("https://api.chucknorris.io/jokes/random", "get", null, null).then(function (result) {
            _this.setState({
                chuckNorris: result.value
            })
        }).catch(function (error) {
            console.log(error);
        })
    }

    componentDidMount() {

        //Make call out to get chuck norris joke
        var _this = this;
        _this.serverRequest = HttpRequest.httpRequest("https://api.chucknorris.io/jokes/random", "get", null, null).then(function (result) {
            _this.setState({
                chuckNorris: result.value
            })
        }).catch(function (error) {
            console.log(error);
        })

    }

    render() {
        return (
            <div key="contact-key" id="contact-id" className="contactClass">
                <span><h1>Contact Us</h1></span>
                <ChuckNorris chuckNorrisFromParent={this.state.chuckNorris} callChuckNorris={this.callChuckNorris}></ChuckNorris>
                <br />
                <TestModule/>
            </div>
        );
    }
}
export default Contact;