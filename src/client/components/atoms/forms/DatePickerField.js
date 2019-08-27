/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import PropTypes from 'prop-types';
import { styledComponent } from '../../../utils/styledComponent';
import { colors } from '../../../config/styles';

import 'react-datepicker/dist/react-datepicker.css';

const StyledDiv = styledComponent('div', {
  '& input': {
    '&:-webkit-autofill': {
      background: colors.form.background,
    },
    background: colors.form.background,
    border: `1px solid ${colors.form.stroke}`,
    borderRadius: '4px',
    display: 'block',
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

const DatePickerField = ({ label, name, setFieldValue, values }) => (
  <StyledDiv>
    <label id={name} htmlFor={name}>
      {label}
    </label>
    <DatePicker
      name="purchased_on"
      onChange={e => {
        setFieldValue('purchased_on', moment(e).format('YYYY-MM-DD'));
      }}
      value={values ? values.purchased_on : ''}
    />
  </StyledDiv>
);

DatePickerField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  values: PropTypes.shape({
    purchased_on: PropTypes.string.isRequired,
  }).isRequired,
};

export default DatePickerField;
