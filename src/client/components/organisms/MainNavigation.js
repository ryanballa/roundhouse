import React from 'react';
import { NavLink } from 'react-router-dom';
import { styledComponent } from '../../utils/styledComponent';

const StyledUL = styledComponent('ul', {
  '& a': {
    borderRadius: '10px',
    color: '#4c8294',
    letterSpacing: '2px',
    padding: '10px',
    textDecoration: 'none',
  },
  '& a.active': {
    backgroundColor: '#6AACC1',
    boxShadow: '1p 1px #ccc',
    color: '#efefef',
    textShadow: '1px 1px #827660',
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
  margin: '0 0 0 20px',
  marginTop: '15px',
  padding: 0,
});

const checkLocomotivesActive = (match, location) =>
  location.pathname.includes('locomotives');

const checkRailcarsActive = (match, location) =>
  location.pathname.includes('railcars');

const checkPhotosActive = (match, location) =>
  location.pathname.includes('photos');

const MainNavigation = () => (
  <StyledUL>
    <li>
      <NavLink
        isActive={checkLocomotivesActive}
        activeClassName="active"
        to="/locomotives"
      >
        Locomotives
      </NavLink>
    </li>
    <li>
      <NavLink
        isActive={checkRailcarsActive}
        activeClassName="active"
        to="/railcars"
      >
        Railcars
      </NavLink>
    </li>
    <li>
      <NavLink
        isActive={checkPhotosActive}
        activeClassName="active"
        to="/photos"
      >
        Photos
      </NavLink>
    </li>
  </StyledUL>
);

export default MainNavigation;
