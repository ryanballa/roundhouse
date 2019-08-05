import React from 'react';
import PropTypes from 'prop-types';
import { styledComponent } from '../../utils/styledComponent';
import { colors } from '../../config/styles';

const StyledButton = styledComponent('button', {
  '&:hover': {
    cursor: 'pointer',
  },
  backgroundColor: colors.form.buttonPrimaryBacgkround,
  border: 'none',
  borderRadius: '4px',
  color: colors.form.buttonPrimary,
  fontSize: '18px',
  fontWeight: '800',
  padding: '15px',
});

const Button = ({ children, ...otherProps }) => (
  <StyledButton type="submit" {...otherProps}>
    {children}
  </StyledButton>
);

Button.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

Button.defaultProps = {
  children: 'Submit',
};

export default Button;
