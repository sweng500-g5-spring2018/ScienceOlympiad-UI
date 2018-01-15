import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.

            <p><Link to="/">Home</Link></p>

            <p><Link to="/contact">Contact</Link></p>

            <p><Link to="/notFound">Not Exist</Link></p>
            {this.props.children}
        </p>
      </div>
    );
  }
}

export default App;
