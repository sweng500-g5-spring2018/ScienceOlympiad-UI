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
                                <a href="/#/app/dashboard">
                                    Home
                                </a>
                            </li>
                            <li>
                                <a href="www.psu.edu">
                                    PSU
                                </a>
                            </li>
                            <li>
                                <a href="https://www.soinc.org/">
                                    Science Olympiad
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
