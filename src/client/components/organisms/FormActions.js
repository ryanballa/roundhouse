import React from 'react';
import PropTypes from 'prop-types';
import { styledComponent } from '../../utils/styledComponent';

const StyledDiv = styledComponent('div', {
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
});

const FormActions = ({ children }) => <StyledDiv>{children}</StyledDiv>;

FormActions.propTypes = {
  children: PropTypes.node.isRequired,
};

export default FormActions;
