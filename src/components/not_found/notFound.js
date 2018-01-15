import React, { Component } from 'react';
import './notFound.css';

class NotFound extends Component {
    render() {
        return (
            <div key="notFound-key" className="notFoundClass">
                <h1>Resource not found.</h1>
            </div>
        );
    }
}
export default NotFound;