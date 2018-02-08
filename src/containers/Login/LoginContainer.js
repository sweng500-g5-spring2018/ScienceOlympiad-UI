import React, {Component} from 'react';
import Login from "../../components/Login/Login";
import Signup from "../../components/Login/Signup";
import $ from 'jquery';
import NotificationSystem from 'react-notification-system';

import mountainBackground from '../../assets/img/Mountain.jpg';

import {style} from "../../variables/Variables";

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

        $('#login-container-slider').toggleClass('collapse');
        $('#signup-container-slider').toggleClass('collapse');

    }

    isLoggedIn() {
        return false;
    }

    addNotification(message, level, position, autoDismiss) {
        this.state._notificationSystem.addNotification({
            title: (<span data-notify="icon" className="pe-7s-door-lock"></span>),
            message: (
                <div>
                    {message}
                </div>
            ),
            level: 'error',
            position: 'tc',
            autoDismiss: 10,
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


        if(this.isLoggedIn()) {
            return <div id='logged-in-successful-yo'></div>
        } else {
            return (
                <div id='login-container' className="login-center"  style={backgroundStyle}>
                    <NotificationSystem ref="notificationSystem" style={style}/>
                    <div id='login-container-card' className="login-card row">
                        <div id='login-container-slider' className="animated bounceInLeft">
                            <Login notify={this.addNotification}/>
                            <a onClick={event => this.toggleLoginView(event)} className="col-sm-10">Or Click for Coach Signup</a>
                        </div>
                        <div id='signup-container-slider' className="animated collapse bounceInLeft">
                            <Signup notify={this.addNotification}/>
                            <a onClick={event => this.toggleLoginView(event)} className="col-sm-9">Or Click for User Login </a>
                        </div>
                    </div>
                </div>
            )
        }
    }

}

export default LoginContainer;