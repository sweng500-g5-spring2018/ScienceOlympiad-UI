import React, {Component} from 'react';
import AuthService from "../../utils/AuthService";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

class LogoutModal extends Component {

    constructor(props) {
        super (props);

        this.handleClose = this.handleClose.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.state = {
            open: true,
        };
    }

    handleOpen = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        AuthService.revokeAuth(true);
        this.setState({open: false});
    };


    render() {
        const actions = [
            <FlatButton
                label="OK"
                primary={true}
                disabled={false}
                onClick={this.handleClose}
            />
        ];

        return (
            <div id="logout-modal">
                <MuiThemeProvider>
                    <div id="logged-out-user-div" >
                        <RaisedButton label="Modal Dialog" onClick={this.handleOpen} />
                        <Dialog
                            title="Session Ended"
                            actions={actions}
                            modal={true}
                            open={this.state.open}
                        >
                            Your session has ended.  You must log in to continue.
                        </Dialog>
                    </div>
                </MuiThemeProvider>
            </div>
        )
    }
}
