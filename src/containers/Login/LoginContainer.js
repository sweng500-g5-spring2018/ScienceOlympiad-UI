import React, {Component} from 'react';
import Login from "../../components/Login/Login";
import Signup from "../../components/Login/Signup";
import Forgot from "../../components/Login/Forgot";
import $ from 'jquery';
import NotificationSystem from 'react-notification-system';

import mountainBackground from '../../assets/img/SmallerMountain.jpg';

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

        var value = event.target.attributes.getNamedItem('data-type').value;

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
            default :
                break;
        }
    }

    addNotification(message, level, position, autoDismiss) {
        if(this.state._notificationSystem) {
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
    }

    componentDidMount() {
        this.setState({_notificationSystem: this.refs.notificationSystem}, () => {
            this.addNotification(
                <span>Please <b>Login</b> to the Science Olympiad System.</span>,
                'info',
                'tc',
                10
            )
        })
    }

    render() {

        return (
            <div id='login-container' className="animated fadeIn login-center"  style={backgroundStyle}>
                <NotificationSystem ref="notificationSystem" style={style}/>
                <div id='login-container-card' className="login-card row">
                    <div id='login-container-slider' className="animated fadeIn">
                        <Login notify={this.addNotification}/>
                        <a data-type={'forgot'} onClick={event => this.toggleLoginView(event)} className="col-sm-10">Forgot your password?</a>
                        <br/>
                        <a data-type={'register'} onClick={event => this.toggleLoginView(event)} className="col-sm-10">Register for a new account</a>
                        <br/>

                    </div>
                    <div id='signup-container-slider' className="animated collapse fadeIn">
                        <Signup notify={this.addNotification}/>
                        <br/>
                        <a data-type={'slogin'} onClick={event => this.toggleLoginView(event)} className="col-sm-9">Return to the login screen</a>
                    </div>
                    <div id='forgot-container-slider' className="animated collapse fadeIn">
                        <Forgot notify={this.addNotification}/>
                        <br/>
                        <a data-type={'flogin'} onClick={event => this.toggleLoginView(event)} className="col-sm-9">Return to the login screen</a>
                    </div>
                </div>
            </div>
        )

    }

}

export default LoginContainer;