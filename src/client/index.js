import React from 'react';
import 'babel-polyfill';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './Routes';
import { UserProvider } from './UserProvider';

ReactDOM.render(
  <main>
    <UserProvider>
      <Router>
        <Routes />
      </Router>
    </UserProvider>
  </main>,
  document.getElementById('root'),
);
