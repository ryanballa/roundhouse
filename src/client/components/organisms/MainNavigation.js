import React from 'react';
import { NavLink } from 'react-router-dom';
import { styledComponent } from '../../utils/styledComponent';

const StyledUL = styledComponent('ul', {
  '& a': {
    borderRadius: '10px',
    color: '#FFFFFF',
    letterSpacing: '2px',
    padding: '10px',
    textDecoration: 'none',
  },
  '& a.active': {
    backgroundColor: '#b6c4d1',
    boxShadow: '1p 1px #ccc',
    textShadow: '1px 1px #86909a',
  },
  '& a:hover': {
    backgroundColor: '#b6c4d1',
  },
  '& li': {
    display: 'inline',
    listStyleType: 'none',
    margin: '0 5px',
  },
  display: 'inline',
  margin: 0,
  marginTop: '15px',
  padding: 0,
});

const checkConfigureActive = (match, location) =>
  location.pathname.includes('configure');

const MainNavigation = () => (
  <StyledUL>
    <li>
      <NavLink
        isActive={checkConfigureActive}
        activeClassName="active"
        to="/locomotives"
      >
        Locomotives
      </NavLink>
    </li>
    <li>
      <NavLink activeClassName="active" to="/run/boards">
        Users
      </NavLink>
    </li>
  </StyledUL>
);

export default MainNavigation;
