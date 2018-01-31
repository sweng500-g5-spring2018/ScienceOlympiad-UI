import React, { Component } from 'react';

class LoginBootstrap extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password:''
        }

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
        event.preventDefault();
        alert('user: ' + this.state.username + '... pass: ' + this.state.password);
        console.log(this.state);
    }

    render() {
        return (
            <div id="login2" className="login-wrapper">
                <form className="form-login" onSubmit={event => this.handleClick(event)}>
                    <h2 className="form-login-heading">Please login</h2>
                    <input type="text" className="form-control-input" name="username" placeholder="Email Address" required autoFocus
                           onChange = {(event) => this.setState({username: event.target.value})} />
                    <input type="password" className="form-control-input" name="password" placeholder="Password" required
                           onChange = {(event) => this.setState({password: event.target.value})} />
                    <label className="checkbox-label">
                        <input type="checkbox" value="remember-me" id="rememberMe" name="rememberMe" /> Remember me
                    </label>
                    <button className="btn btn-lg btn-primary btn-block" type="submit">Login</button>
                </form>
            </div>
        )
    }
}


export default LoginBootstrap;
