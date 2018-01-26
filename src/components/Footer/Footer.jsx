import React, {Component} from 'react';
import { Grid } from 'react-bootstrap';

class Footer extends Component {
	render() {
		return (
            <footer className="footer">
                <Grid>
                    <nav className="pull-left">
                        <ul>
                            <li>
                                <a href="#nowhere">
                                    Home
                                </a>
                            </li>
                            <li>
                                <a href="#idk">
                                    PSU
                                </a>
                            </li>
                            <li>
                                <a href="#idk">
                                    Idk
                                </a>
                            </li>
                            <li>
                                <a href="#idk">
                                   idk
                                </a>
                            </li>
                        </ul>
                    </nav>
                    <p className="copyright pull-right">
                        &copy; {(new Date()).getFullYear()} - SWENG500 - Group 5
                    </p>
                </Grid>
            </footer>
		);
	}
}

export default Footer;
