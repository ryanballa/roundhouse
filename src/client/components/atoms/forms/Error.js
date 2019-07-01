import React from 'react';
import PropTypes from 'prop-types';
import { styledComponent } from '../../../utils/styledComponent';
import { colors } from '../../../config/styles';

const StyledDiv = styledComponent('div', {
  color: colors.error,
  paddingTop: '5px',
});

const Error = ({ children }) => <StyledDiv>{children}</StyledDiv>;

Error.propTypes = {
  children: PropTypes.node,
};

Error.defaultProps = {
  children: null,
};

export default Error;
