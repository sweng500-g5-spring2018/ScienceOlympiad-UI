import React, { Component } from 'react';
//import '../../../style/contact.css';
import HttpRequest from '../../adapters/httpRequest';

import ChuckNorris from './chuckNorris';

class Contact extends Component {

    constructor(props) {
        super(props);

        this.state = {
            chuckNorris: ""
        };

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
                <ChuckNorris chuckNorrisFromParent={this.state.chuckNorris}></ChuckNorris>
            </div>
        );
    }
}
export default Contact;