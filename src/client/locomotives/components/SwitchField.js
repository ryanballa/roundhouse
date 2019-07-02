import React from 'react';
import { Switch } from 'evergreen-ui';
import PropTypes from 'prop-types';

const SwitchField = ({ id, field }) => (
  <div>
    <Switch
      id={id}
      name={field.name}
      value={field.value ? field.value.toString() : 'false'}
      onBlur={field.onBlur}
      checked={field.value}
      onChange={field.onChange}
    />
  </div>
);

SwitchField.propTypes = {
  field: PropTypes.shape({
    name: PropTypes.string,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    value: PropTypes.string,
  }).isRequired,
  id: PropTypes.string.isRequired,
};

export default SwitchField;
