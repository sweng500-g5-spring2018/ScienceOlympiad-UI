import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ChuckNorris extends Component {

    render() {

        return (
            <div key="contact-chuck-container-div" className="chuckNorrisClass">
                <a href="https://en.wikipedia.org/wiki/Chuck_Norris">Chuck Norris!!!</a>
                <br />
                <span key="chuck-norris-quote"> {this.props.chuckNorrisFromParent} </span>
            </div>
        );
    }
}

export default ChuckNorris;

ChuckNorris.propTypes = {
    chuckNorrisFromParent: PropTypes.string
}

ChuckNorris.defaultProps = {
    chuckNorrisFromParent: ". . ."
}