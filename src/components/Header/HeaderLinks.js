import React, {Component} from 'react';
import { NavItem, Nav } from 'react-bootstrap';

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
        return (
            <div>
                <Nav pullRight>
                    <NavItem eventKey={1} href="/#/app/user">Account</NavItem>
                    <NavItem eventKey={3} onClick={this.onLogoutClick}>Log out</NavItem>
                </Nav>
            </div>
        );
    }
}

export default HeaderLinks;
