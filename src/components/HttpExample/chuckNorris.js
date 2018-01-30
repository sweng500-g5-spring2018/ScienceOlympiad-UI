import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ChuckNorris extends Component {

    render() {

        return (
            <div id="contact-chuck-container-div" key="contact-chuck-container-div" className="chuckNorrisClass">
                <button onClick={event => this.props.callChuckNorris(event) }>Chuck Norris!!!</button>
                <br />
                <span key="chuck-norris-quote"> {this.props.chuckNorrisFromParent} </span>
            </div>
        );
    }
}

export default ChuckNorris;

ChuckNorris.propTypes = {
    chuckNorrisFromParent: PropTypes.string,
    callChuckNorris: PropTypes.any
}

ChuckNorris.defaultProps = {
    chuckNorrisFromParent : ". . .",
    callChuckNorris : null
}