import React from 'react';
import PropTypes from 'prop-types';
import { fontConfig } from '../../config/styles';
import { styledComponent } from '../../utils/styledComponent';
import Header from '../organisms/Header';

const StyledSection = styledComponent('section', {
  '& h1, & h2': {
    fontFamily: fontConfig.familyStylized
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
