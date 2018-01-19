import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../_assets/logo.svg';
//import '../../../style/App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Science Olympiad</h1>
        </header>
        <p className="App-intro">
          Welcome to Science Olympaid :) a currently barebones react app that doesn't do anything!
        </p>

        <p><Link to="/">Home</Link></p>

        <p><Link to="/contact">Contact</Link></p>

        <p><Link to="/notFound">Not Exist</Link></p>

      </div>
    );
  }
}

export default App;
