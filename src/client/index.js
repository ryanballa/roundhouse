import React from 'react'
import ReactDOM from 'react-dom'
import Routes from './Routes'
import { BrowserRouter as Router } from "react-router-dom";
import "babel-polyfill"


ReactDOM.render(
  <main>
    <div className={`fade fade-${status}`}>
      <Router>
        <Routes />
      </Router>
    </div>
  </main>,
  document.getElementById('root')
);
