/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'formik';
import { styledComponent } from '../../../utils/styledComponent';
import { colors } from '../../../config/styles';

const StyledDiv = styledComponent('div', {
  '& input': {
    '&:-webkit-autofill': {
      background: colors.form.background,
    },
    background: colors.form.background,
    border: `1px solid ${colors.form.stroke}`,
    borderRadius: '4px',
    display: 'block',
    height: '35px',
    marginTop: '10px',
    padding: '15px',
  },
  '& label': {
    color: colors.form.label,
    display: 'block',
    fontSize: '18px',
    fontWeight: '800',
  },
});

const Input = ({ label, name, type }) => (
  <StyledDiv>
    <label id={name} htmlFor={name}>
      {label}
      <Field
        autoComplete="off"
        id={name}
        type={type}
        name={name}
        placeholder=""
      />
    </label>
  </StyledDiv>
);

Input.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['text', 'password']),
};

Input.defaultProps = {
  type: 'text',
};

export default Input;
