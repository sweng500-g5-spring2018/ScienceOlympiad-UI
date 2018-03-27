import React, {Component} from 'react';
import { NavItem, Nav, NavDropdown, MenuItem } from 'react-bootstrap';

import AuthService from '../../utils/AuthService';


class HeaderLinks extends Component{

    constructor(props) {
        super(props);

        this.onLogoutClick = this.onLogoutClick.bind(this);
    }

    onLogoutClick(event) {
        event.preventDefault();

        AuthService.logout().then(function (result) {
            console.log(result);
        }).catch(function (error) {
            console.log(error);
        }).then( () => {
            window.location = '/';
        });

    }

    render(){
        const notification = (
            <div>
                <i className="fa fa-globe"></i>
                <b className="caret"></b>
                <span className="notification">5</span>
                <p className="hidden-lg hidden-md">Notification</p>
            </div>
        );
        return (
            <div>
                <Nav>
                    {/*<NavItem eventKey={1} href="#">*/}
                        {/*<i className="fa fa-dashboard"></i>*/}
                        {/*<p className="hidden-lg hidden-md">Dashboard</p>*/}
                    {/*</NavItem>*/}
                    {/*<NavItem eventKey={3} href="#">*/}
                        {/*<i className="fa fa-search"></i>*/}
                        {/*<p className="hidden-lg hidden-md">Search</p>*/}
                    {/*</NavItem>*/}
                </Nav>
                <Nav pullRight>
                    <NavItem eventKey={1} href="/#/app/user">Account</NavItem>
                    <NavItem eventKey={3} onClick={this.onLogoutClick}>Log out</NavItem>
                </Nav>
            </div>
        );
    }
}

export default HeaderLinks;
