import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ChuckNorris extends Component {

    render() {

        return (
            <div id="contact-chuck-container-div" key="contact-chuck-container-div" className="chuckNorrisClass">
                <hr />
                <span key="chuck-norris-quote"> {this.props.chuckNorrisFromParent} </span>
                <br />
                <button onClick={event => this.props.callChuckNorris(event) }>Chuck Norris Me</button>
                <hr />
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