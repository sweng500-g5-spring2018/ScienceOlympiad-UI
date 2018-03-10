import React, { Component } from 'react';
import HttpRequest from '../../adapters/httpRequest';

import ChuckNorris from './ChuckNorris';

class ChuckParent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            chuckNorris: ""
        };

        this.callChuckNorris();

        this.callChuckNorris = this.callChuckNorris.bind(this);
    }

    callChuckNorris(event) {
        if(event) {event.preventDefault() };

        //Make call out to get chuck norris joke
        var _this = this;
        _this.serverRequest = HttpRequest.httpRequest("https://api.chucknorris.io/jokes/random", "get", null, null).then(function (result) {
            _this.setState({
                chuckNorris: result.body.value
            })
        }).catch(function (error) {
            console.log(error);
        })
    }

    render() {
        return (
            <div key="contact-key" id="contact-id" className="contactClass">
                <span><h1>Chuck Norris Says</h1></span>
                <ChuckNorris
                    chuckNorrisFromParent={this.state.chuckNorris}
                    callChuckNorris={this.callChuckNorris}>
                </ChuckNorris>
            </div>
        );
    }
}
export default ChuckParent;