import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';

export class StatsCard extends Component{
    render(){
        return (
            <div className="card card-stats" style={{'textAlign':'left'}}>
                <div className="content">
                    <div className="numbers">
                        <div style={{textAlign:'left', fontWeight:'bold', fontSize:'14pt'}}>{this.props.bigIcon} {this.props.statsText}</div>
                    </div>
                    <div className="numbers">
                        <span style={{textAlign:'left', fontSize:'12pt'}}>{this.props.statsValue}</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default StatsCard;
