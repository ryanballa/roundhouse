import React from 'react';
import PropTypes from 'prop-types';
import { fontConfig, zIndex } from '../../config/styles';
import { styledComponent } from '../../utils/styledComponent';
import Header from '../organisms/Header';

const StyledSection = styledComponent('section', {
  fontFamily: fontConfig.familyBody,
  margin: 20,
  position: 'relative',
  zIndex: zIndex.layout,
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
