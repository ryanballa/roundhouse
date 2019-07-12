import React from 'react';
import { Link } from 'react-router-dom';
import { styledComponent } from '../../utils/styledComponent';
import { fontConfig, spacing } from '../../config/styles';
import MainNavigation from './MainNavigation';

const StyledHeader = styledComponent('header', {
  '& h1': {
    display: 'inline',
    margin: 0,
    ...fontConfig.h1,
  },
  backgroundColor: '#8b96a0',
  boxShadow: '1px 1px 1px rgba(0, 0, 0, 0.3)',
  color: '#FFFFFF',
  fontFamily: fontConfig.familyStylized,
  padding: spacing.boxPadding,
});

const Header = () => (
  <StyledHeader>
    <h1>
      <Link to="/">Roundhouse</Link>
    </h1>
    <MainNavigation />
  </StyledHeader>
);

export default Header;
