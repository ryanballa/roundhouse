import React from 'react';
import PropTypes from 'prop-types';
import { colors, fontConfig } from '../../config/styles';
import { styledComponent } from '../../utils/styledComponent';
import Header from '../organisms/Header';

const StyledSection = styledComponent('section', {
  '& a': {
    color: colors.headers,
  },
  '& h1, & h2': {
    color: colors.headers,
    fontFamily: fontConfig.familyStylized,
  },
  fontFamily: fontConfig.familyBody,
  margin: 30,
});

const SingleColumn = ({ children }) => (
  <div>
    <Header />
    {/* <SubNavigation /> */}
    <StyledSection>{children}</StyledSection>
  </div>
);

SingleColumn.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SingleColumn;
