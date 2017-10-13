import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

function greetUser(user) {
  return <p>Hello {user.firstName} {user.lastName}</p>;
}

class App extends Component {
  render() {
    const helloWorld = {
      title: 'Welcome to the Road to learn React',
      message: 'React is awesome! With Hot Module Reloading!'
    };

    const user = {
      firstName: 'Wakim',
      lastName: 'Jraige'
    };

    return (
      <div className="App">
        <h1>{helloWorld.title}</h1>
        <h2>{helloWorld.message}</h2>
        {greetUser(user)}
      </div>
    );
  }
}

export default App;
