import React, {Component} from 'react';
import Login from "../../components/Login/Login";
import Signup from "../../components/Login/Signup";
import Forgot from "../../components/Login/Forgot";
import $ from 'jquery';
import NotificationSystem from 'react-notification-system';


import mountainBackground from '../../assets/img/SmallerMountain.jpg';

import {style} from "../../variables/Variables";

import HttpRequest from '../../adapters/httpRequest';
import constants from "../../utils/constants";

const backgroundStyle = {
    background: 'url(' + mountainBackground + ') no-repeat center center fixed',
    backgroundSize: 'cover',
    backgroundPosition: 'center center no-repeat'
};



class LoginContainer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            view: "login",
            _notificationSystem: null
        };

        this.addNotification = this.addNotification.bind(this);
    }

    toggleLoginView(event) {
        event.preventDefault();

        var value = event.target.attributes.getNamedItem('data-Type').value;

        switch (value) {
            case 'register':
                $('#login-container-slider').addClass('collapse');
                $('#signup-container-slider').removeClass('collapse');
                break;
            case 'forgot':
                $('#login-container-slider').addClass('collapse');
                $('#forgot-container-slider').removeClass('collapse');
                break;
            case 'slogin':
                $('#login-container-slider').removeClass('collapse');
                $('#signup-container-slider').addClass('collapse');
                break;
            case 'flogin':
                $('#login-container-slider').removeClass('collapse');
                $('#forgot-container-slider').addClass('collapse');
                break;
        }
    }

    addNotification(message, level, position, autoDismiss) {
        this.state._notificationSystem.addNotification({
            title: (<span data-notify="icon" className="pe-7s-door-lock"></span>),
            message: (
                <div>
                    {message}
                </div>
            ),
            level: level ? level : 'error',
            position: position ? position : 'tc',
            autoDismiss: autoDismiss ? autoDismiss : 10,
        });
    }

    componentDidMount() {
        this.setState({_notificationSystem: this.refs.notificationSystem});
        var _notificationSystem = this.refs.notificationSystem;

        _notificationSystem.addNotification({
            title: (<span data-notify="icon" className="pe-7s-door-lock"></span>),
            message: (
                <div>
                    Please <b>Login</b> to the Science Olympiad System.
                </div>
            ),
            level: 'info',
            position: 'tc',
            autoDismiss: 20,
        });
    }

    render() {

        return (
            <div id='login-container' className="animated fadeIn login-center"  style={backgroundStyle}>
                <NotificationSystem ref="notificationSystem" style={style}/>
                <div id='login-container-card' className="login-card row">
                    <div id='login-container-slider' className="animated fadeIn">
                        <Login notify={this.addNotification}/>
                        <a data-Type={'forgot'} onClick={event => this.toggleLoginView(event)} className="col-sm-10">Forgot your password?</a>
                        <br/>
                        <a data-Type={'register'} onClick={event => this.toggleLoginView(event)} className="col-sm-10">Register for a new account</a>
                        <br/>

                    </div>
                    <div id='signup-container-slider' className="animated collapse fadeIn">
                        <Signup notify={this.addNotification}/>
                        <br/>
                        <a data-Type={'slogin'} onClick={event => this.toggleLoginView(event)} className="col-sm-9">Return to the login screen</a>
                    </div>
                    <div id='forgot-container-slider' className="animated collapse fadeIn">
                        <Forgot notify={this.addNotification}/>
                        <br/>
                        <a data-Type={'flogin'} onClick={event => this.toggleLoginView(event)} className="col-sm-9">Return to the login screen</a>
                    </div>
                </div>
            </div>
        )

    }

}

export default LoginContainer;