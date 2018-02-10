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
import InputMask from 'react-input-mask'


class Signup extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            finished: false,
            stepIndex: 0,
            firstName: '',
            lastName:'',
            phoneNumber:'',
            emailAddress:'',
            password:'',
            confirm:'',
            district:''
        }
    }

    handleNext = () => {
        const {stepIndex} = this.state;

        var missingInfo=0;


        if (stepIndex === 0) {

            if (this.state.firstName.trim()) {
                this.setState({
                    firstName: this.state.firstName.trim(),
                    firstNameRequired: undefined
                })
            }
            else {
                this.setState({
                    firstName: this.state.firstName.trim(),
                    firstNameRequired: "First name is required."
                })
                missingInfo = 1;
            }

            if (this.state.lastName.trim()) {
                this.setState({
                    lastName: this.state.lastName.trim(),
                    lastNameRequired: undefined
                })
            }
            else {
                this.setState({
                    lastName: this.state.lastName.trim(),
                    lastNameRequired: "Last name is required."
                })
                missingInfo = 1;
            }

            if (this.state.phoneNumber.trim()) {
                this.setState({
                    phoneNumber: this.state.phoneNumber.trim(),
                    phoneNumberRequired: undefined
                })
            }
            else {
                this.setState({
                    phoneNumber: this.state.phoneNumber.trim(),
                    phoneNumberRequired: "A phone number is required."
                })
                missingInfo = 1;
            }

            if(this.state.emailAddress.trim()) {
                this.setState({
                    emailAddress: this.state.emailAddress.trim(),
                    emailAddressRequired: undefined
                })
            }
            else {
                this.setState({
                    emailAddress: this.state.emailAddress.trim(),
                    emailAddressRequired: "An email address is required."
                })
                missingInfo = 1;
            }
        }
        else if (stepIndex === 1) {



            if(this.state.password.trim()) {
                this.setState({
                    password: this.state.password.trim(),
                    passwordRequired: undefined
                })
            }
            else {
                this.setState({
                    password: this.state.password.trim(),
                    passwordRequired: "A password is required."
                })
                missingInfo = 1;
            }

            if(this.state.confirm.trim()) {
                this.setState({
                    confirm: this.state.confirm.trim(),
                    confirmRequired: undefined
                })
            }
            else {
                this.setState({
                    confirm: this.state.confirm.trim(),
                    confirmRequired: "A password confirmation is required."
                })
                missingInfo = 1;
            }

            if(this.state.password.trim() !== this.state.confirm.trim())
            {
                this.props.notify(
                    "ERROR: Your passwords do not match.",
                    "error",
                    "tr",
                    6
                );
                missingInfo = 1;
            }
        }


        if (!missingInfo)
        {
            this.setState({
                stepIndex: stepIndex + 1,
                finished: stepIndex >= 2,
            });
        }


    };

    handlePrev = () => {
        const {stepIndex} = this.state;

        if (stepIndex > 0) {
            this.setState({stepIndex: stepIndex - 1});
        }
    };

    handleList(event, index, value) {
        event.persist()
        const field = event.target.id;
        const form = this.state.form;

        event.target.selected.

        console.log(form);
    };

    render() {
        const {finished, stepIndex} = this.state;
        const contentStyle = {margin: '0 16px'};

        return (
            <MuiThemeProvider>
                <AppBar showMenuIconButton={false} title="Account Registration"/>
                <div style={{width: '100%', minWidth: 600, maxWidth: 800, margin: 'auto'}}>
                    <Stepper activeStep={stepIndex} orientation={'vertical'}>
                        <Step>
                            <StepLabel>Personal Information</StepLabel>
                            <StepContent>
                                <TextField
                                hintText="Enter your first name"
                                errorText={this.state.firstNameRequired}
                                floatingLabelText="First name"
                                onChange={(event, newValue) => this.setState({firstName: newValue})}
                                value = {this.state.firstName}
                                required={true}/>
                                &nbsp;&nbsp;
                                <TextField
                                hintText="Enter your last name"
                                errorText={this.state.lastNameRequired}
                                floatingLabelText="Last name"
                                onChange={(event, newValue) => this.setState({lastName: newValue})}
                                value = {this.state.lastName}
                                required={true}/>
                                <br/>
                                <TextField
                                errorText={this.state.phoneNumberRequired}
                                floatingLabelText="Phone number"
                                onChange={(event, newValue) => this.setState({phoneNumber: newValue})}
                                value = {this.state.phoneNumber}
                                required={true}>
                                    <InputMask mask="1 (999) 999-9999" maskChar="#"  value = {this.state.phoneNumber}/>
                                </TextField>
                                &nbsp;&nbsp;
                                <TextField
                                hintText="Enter your email address"
                                errorText={this.state.emailAddressRequired}
                                floatingLabelText="Email address"
                                onChange={(event, newValue) => this.setState({emailAddress: newValue})}
                                value = {this.state.emailAddress}
                                required={true}/>
                            </StepContent>
                        </Step>
                        <Step>
                            <StepLabel>Account Information</StepLabel>
                            <StepContent>
                                <TextField
                                type="password"
                                hintText="Enter your password"
                                errorText={this.state.passwordRequired}
                                floatingLabelText="Password"
                                onChange={(event, newValue) => this.setState({password: newValue})}
                                value = {this.state.password}
                                required={true}/>
                                    &nbsp;&nbsp;
                                <TextField
                                type="password"
                                hintText="Confirm your password"
                                errorText={this.state.confirmRequired}
                                floatingLabelText="Confirm your password"
                                onChange={(event, newValue) => this.setState({confirm: newValue})}
                                value = {this.state.confirm}
                                required={true}/>
                                <br/>
                                <SelectField
                                hintText="Select your district"
                                floatingLabelText="School district"
                                onChange={(event, index, value) => this.setState({value})}
                                maxHeight={200}
                                value={this.state.value}>
                                    <MenuItem primaryText="Berwick" value='1'/>
                                    <MenuItem primaryText="Crestwood" value='2' />
                                    <MenuItem primaryText="Dallas" value='3'/>
                                    <MenuItem primaryText="Greater Nanticoke" value='4'/>
                                    <MenuItem primaryText="Hanover" value='5'/>
                                    <MenuItem primaryText="Hazleton" value='6'/>
                                    <MenuItem primaryText="Lake-Lehman" value='7'/>
                                    <MenuItem primaryText="Northwest" value='8'/>
                                    <MenuItem primaryText="Non-public" value='9'/>
                                    <MenuItem primaryText="Pittston" value='10'/>
                                    <MenuItem primaryText="Wilkes-Barre" value='11'/>
                                    <MenuItem primaryText="Wyoming Area" value='12'/>
                                    <MenuItem primaryText="Wyoming Valley West" value='13'/>
                                    <MenuItem primaryText="CTC Hazleton" value='14'/>
                                    <MenuItem primaryText="West Side Area Vocational" value='15'/>
                                    <MenuItem primaryText="Wilkes-Barre Area Vocational" value='16'/>
                                </SelectField>
                            </StepContent>
                        </Step>
                        <Step>
                            <StepLabel>Account Creation</StepLabel>
                            <StepContent>Congratulations! Your account has been created.</StepContent>
                        </Step>
                    </Stepper>
                    <div style={contentStyle}>
                        <div>
                            <div style={{marginTop: 12}}>
                                <FlatButton
                                    label="Back"
                                    disabled={stepIndex === 0}
                                    onClick={this.handlePrev}
                                    style={{marginRight: 12}}/>
                                <RaisedButton
                                    label={stepIndex === 2 ? 'Return to login' : 'Next'}
                                    primary={true}
                                    onClick={this.handleNext}/>
                            </div>
                        </div>
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default Signup;