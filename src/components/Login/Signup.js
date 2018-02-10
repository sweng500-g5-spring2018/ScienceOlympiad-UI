import React from 'react';
import {
    Step,
    Stepper,
    StepLabel,
    StepContent,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';
import AppBar from 'material-ui/AppBar';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

/**
 * Horizontal steppers are ideal when the contents of one step depend on an earlier step.
 * Avoid using long step names in horizontal steppers.
 *
 * Linear steppers require users to complete one step in order to move on to the next.
 */
class HorizontalLinearStepper extends React.Component {

    state = {
        finished: false,
        stepIndex: 0,
    };

    handleNext = () => {
        const {stepIndex} = this.state;
        this.setState({
            stepIndex: stepIndex + 1,
            finished: stepIndex >= 2,
        });
    };

    handlePrev = () => {
        const {stepIndex} = this.state;
        if (stepIndex > 0) {
            this.setState({stepIndex: stepIndex - 1});
        }
    };

    getStepContent(stepIndex) {
        switch (stepIndex) {
            case 0:
                return (1);
            case 1:
                return (1);
            case 3:
                return 'Your account has been created. You are being re-directed to the login screen.';
            default:
                return 'adsfasdfasdf';
        }
    }

    render() {
        const {finished, stepIndex} = this.state;
        const contentStyle = {margin: '0 16px'};

        return (
            <MuiThemeProvider>
                <AppBar showMenuIconButton={false} title="Account Registration"/>
            <div style={{width: '100%', maxWidth: 700, margin: 'auto'}}>
                <Stepper activeStep={stepIndex} orientation={'vertical'}>
                    <Step>
                        <StepLabel>Personal Info</StepLabel>
                        <StepContent>
                            <TextField
                            hintText="Enter your first name"
                            errorText={this.state.userRequired}
                            floatingLabelText="First name"
                            onChange={(event, newValue) => this.setState({username: newValue})}
                            required={true}
                        />
                            <br/>
                            <TextField
                                hintText="Enter your last name"
                                errorText={this.state.userRequired}
                                floatingLabelText="Last name"
                                onChange={(event, newValue) => this.setState({username: newValue})}
                                required={true}
                            />
                            <br/>
                            <TextField
                                hintText="Enter your Phone Number"
                                errorText={this.state.userRequired}
                                floatingLabelText="Phone number"
                                onChange={(event, newValue) => this.setState({username: newValue})}
                                required={true}
                            />
                            <br/>
                        <SelectField
                        hintText="Select your school district"
                        floatingLabelText="School district"
                        >
                        <MenuItem>Hanover Area</MenuItem>
                            <MenuItem>Wyoming Area</MenuItem>
                            <MenuItem>Wyoming Valley West</MenuItem>
                        </SelectField>
                        </StepContent>
                    </Step>
                    <Step>
                        <StepLabel>Account Info</StepLabel>
                        <StepContent>
                            <TextField
                                hintText="Enter your email address"
                                errorText={this.state.userRequired}
                                floatingLabelText="Email address"
                                onChange={(event, newValue) => this.setState({username: newValue})}
                                required={true}
                            />
                            <br/>
                            <TextField
                                hintText="Enter your password"
                                errorText={this.state.userRequired}
                                floatingLabelText="Password"
                                onChange={(event, newValue) => this.setState({username: newValue})}
                                required={true}
                            />
                            <br/>
                            <TextField
                                hintText="Confirm your password"
                                errorText={this.state.userRequired}
                                floatingLabelText="Confirm your password"
                                onChange={(event, newValue) => this.setState({username: newValue})}
                                required={true}
                            /></StepContent>
                    </Step>
                    <Step>
                        <StepLabel>Complete</StepLabel>
                        <StepContent>Congratulations!<br/>Your account has been created.
                        </StepContent>
                    </Step>
                </Stepper>
                <div style={contentStyle}>
                    {finished ? (
                        <p>
                            <a
                                href="#"
                                onClick={(event) => {
                                    event.preventDefault();
                                    this.setState({stepIndex: 0, finished: false});
                                }}
                            >
                                Click here
                            </a> to reset the example.
                        </p>
                    ) : (
                        <div>
                            <div style={{marginTop: 12}}>
                                <FlatButton
                                    label="Back"
                                    disabled={stepIndex === 0}
                                    onClick={this.handlePrev}
                                    style={{marginRight: 12}}
                                />
                                <RaisedButton
                                    label={stepIndex === 2 ? 'Return to login' : 'Next'}
                                    primary={true}
                                    onClick={this.handleNext}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
            </MuiThemeProvider>
        );
    }
}

export default HorizontalLinearStepper;