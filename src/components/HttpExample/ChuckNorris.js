import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ChuckNorris extends Component {

    render() {

        return (
            <div id="contact-chuck-container-div" key="contact-chuck-container-div" className="chuckNorrisClass">
                <span key="chuck-norris-quote"> {this.props.chuckNorrisFromParent} </span>
                <br />
                <div className="footer">
                    <hr />
                    <div className="stats">
                        <a style={{cursor:'pointer'}} onClick={event => this.props.callChuckNorris(event)}><i className="fa fa-refresh"></i> Update Now</a>
                    </div>
                </div>
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