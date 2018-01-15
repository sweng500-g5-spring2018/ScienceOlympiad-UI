import React, { Component } from 'react';

class ChuckNorris extends Component {

    render() {
        var chuckers = this.props.chuckNorrisFromParent !== {} && typeof this.props.chuckNorrisFromParent == "string" ? this.props.chuckNorrisFromParent : ". . .";

        return (
            <div key="contact-div" className="chuckNorrisClass">
                <a href="https://en.wikipedia.org/wiki/Chuck_Norris">Chuck Norris!!!</a>
                <br />
                <span key="chuck-norris-quote"> {chuckers} </span>
            </div>
        );
    }
}

export default ChuckNorris;