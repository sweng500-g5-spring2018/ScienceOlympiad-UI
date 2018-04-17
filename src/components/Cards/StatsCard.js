import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';

export class StatsCard extends Component{
    render(){
        return (
            <div className="card card-stats" style={{'text-align':'left'}}>
                <div className="content">
                    <div className="numbers">
                        <p style={{'text-align':'left','font-weight':'bold', 'font-size':'14pt'}}>{this.props.bigIcon} {this.props.statsText}</p>
                    </div>
                    <div className="numbers">
                        <p style={{'text-align':'left'}}>{this.props.statsValue}</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default StatsCard;
