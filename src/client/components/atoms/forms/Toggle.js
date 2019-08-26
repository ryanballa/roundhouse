/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import PropTypes from 'prop-types';
import { styledComponent } from '../../../utils/styledComponent';
import { colors } from '../../../config/styles';

const StyledDiv = styledComponent('div', {
  '& .psudeoLabel': {
    color: colors.form.label,
    fontSize: '18px',
    fontWeight: '800',
    marginBottom: '10px',
    width: '300px',
  },
  '& .tray': {
    background: colors.form.stroke,
    borderRadius: '22px',
    display: 'block',
    height: '14px',
    width: '55px',
  },
  '& input': {
    '& + label': {
      '&:hover': {
        cursor: 'pointer',
      },
      borderRadius: '14px',
      left: 0,
      marginBottom: '10px',
      position: 'absolute',
      top: '34px',
      transition: '.3s',
    },
    '&:checked + label': {
      backgroundColor: colors.form.buttonPrimaryBacgkround,
      left: '30px',
    },
    height: '40px',
    visibility: 'hidden',
    width: '55px',
  },
  '& label': {
    backgroundColor: '#9c9c9c',
    display: 'block',
    height: '25px',
    textIndent: '-9000px',
    top: '34px',
    width: '25px',
  },
  position: 'relative',
});

const Toggle = ({ field: { name, value, onChange, onBlur }, id, label }) => {
  return (
    <StyledDiv>
      <div className="psudeoLabel">{label}</div>
      <div className="tray">
        <input
          name={name}
          id={id}
          type="checkbox"
          value={value || 'false'}
          checked={value}
          onChange={onChange}
          onBlur={onBlur}
        />
        <label id={name} htmlFor={name}>
          {label}
        </label>
      </div>
    </StyledDiv>
  );
};

Toggle.propTypes = {
  field: PropTypes.shape({
    name: PropTypes.string,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    value: PropTypes.bool,
  }).isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  setFieldValue: PropTypes.func,
};

Toggle.defaultProps = {
  setFieldValue: () => {},
};

export default Toggle;
