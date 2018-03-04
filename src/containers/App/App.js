import React, { Component } from 'react';
import NotificationSystem from 'react-notification-system';
import {
    Switch,
    Redirect
} from 'react-router-dom';
import AuthenticatedRoute from  '../../routes/AuthenticatedRoute';
import AuthService from '../../utils/AuthService';

import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Sidebar from '../../components/Sidebar/Sidebar';

import {style} from "../../variables/Variables.js";

import appRoutes from '../../routes/app.js';


class App extends Component {
    constructor(props){
        super(props);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.notify = this.notify.bind(this);
        this.state = {
            _notificationSystem: null
        };
    }

    notify(message, level, position, autoDismiss, optionalTitle){
        this.state._notificationSystem.addNotification({
            title: optionalTitle ? optionalTitle : (<span data-notify="icon" className="pe-7s-gift"></span>),
            message: (
                <div>
                    {message}
                </div>
            ),
            level: level ? level : 'info',
            position: position ? position : 'tc',
            autoDismiss: autoDismiss ? autoDismiss : 10,
        });
    }

    componentDidMount(){
        this.setState({_notificationSystem: this.refs.notificationSystem});
        var _notificationSystem = this.refs.notificationSystem;
        var color = Math.floor((Math.random() * 4) + 1);
        var level;
        switch (color) {
            case 1:
                level = 'success';
                break;
            case 2:
                level = 'warning';
                break;
            case 3:
                level = 'error';
                break;
            case 4:
                level = 'info';
                break;
            default:
                break;
        }
        _notificationSystem.addNotification({
            title: (<span data-notify="icon" className="pe-7s-gift"></span>),
            message: (
                <div>
                    Welcome to <b>Science Olympiad Dashboard</b> - a central hub for Science Olympiad Competitions.
                </div>
            ),
            level: level,
            position: "tr",
            autoDismiss: 15,
        });
    }
    componentDidUpdate(e){
        if(window.innerWidth < 993 && e.history.location.pathname !== e.location.pathname && document.documentElement.className.indexOf('nav-open') !== -1){
            document.documentElement.classList.toggle('nav-open');
        }
    }
    render() {
        return (

            <div className="wrapper">
                <NotificationSystem ref="notificationSystem" style={style}/>
                <Sidebar {...this.props} />
                <div id="main-panel" className="main-panel">
                    <Header {...this.props}/>
                        <Switch>
                            {
                                appRoutes.map((prop,key) => {
                                    if(prop.redirect)
                                        return (
                                            <Redirect from={prop.path} to={prop.to} key={key}/>
                                        );

                                    return (
                                        <AuthenticatedRoute path={prop.path} component={prop.component} users={prop.users} key={key} notify={this.notify}/>
                                    );
                                })
                            }
                        </Switch>
                    <Footer />
                </div>
            </div>
        );
    }
}

export default App;
