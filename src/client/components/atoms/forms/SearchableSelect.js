/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { styledComponent } from '../../../utils/styledComponent';
import { colors } from '../../../config/styles';

const StyledDiv = styledComponent('div', {
  '& label': {
    color: colors.form.label,
    display: 'block',
    fontSize: '18px',
    fontWeight: '800',
  },
  '& select': {
    '&:-webkit-autofill': {
      background: colors.form.background,
    },
    background: colors.form.background,
    border: `1px solid ${colors.form.stroke}`,
    borderRadius: '4px',
    display: 'block',
    fontSize: '16px',
    height: '50px',
    marginTop: '10px',
    padding: '15px 30px',
  },
  color: colors.form.label,
});

const SearchableSelect = ({ label, value, options, onChange }) => (
  <StyledDiv>
    <label id={name} htmlFor={name}>
      {label}
    </label>
    <Select
        value={value}
        onChange={(v) => { onChange(v) }}
        options={options} 
    />
  </StyledDiv>
);

SearchableSelect.propTypes = {
  value: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default SearchableSelect;
