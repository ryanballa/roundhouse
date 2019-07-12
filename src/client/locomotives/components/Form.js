/* eslint-disable react/no-multi-comp */
import React from 'react';
import { Button, FormField, Select, Switch } from 'evergreen-ui';
import { Field } from 'formik';
import PropTypes from 'prop-types';
import Error from '../../components/atoms/forms/Error';
import { styledComponent } from '../../utils/styledComponent';
import { colors } from '../../config/styles';
import Gallery from '../../components/organisms/Gallery';

const StyledDiv = styledComponent('div', {
  '& input': {
    border: '1px solid #fffcfc',
    borderRadius: '2px',
    boxShadow: '0 0 0 1px rgba(67, 90, 111, 0.14)',
    padding: '8px',
  },
  '& li': {
    listStyle: 'none',
    marginBottom: '15px',
  },
  '& ul': {
    paddingLeft: 0,
  },
  color: colors.error,
  paddingTop: '5px',
});

const Form = ({
  errors,
  isSubmitting,
  handleSubmit,
  photos,
  setFieldValue,
  touched,
  values,
}) => {
  const SwitchField = ({
    id,
    field: { name, value, onChange, onBlur },
    ...props
  }) => (
    <div>
      <Switch
        id={id}
        name={name}
        value={value ? value.toString() : 'false'}
        onBlur={onBlur}
        checked={value}
        onChange={onChange}
        {...props}
      />
    </div>
  );

  SwitchField.propTypes = {
    field: PropTypes.shape({
      name: PropTypes.string,
      onBlur: PropTypes.func,
      onChange: PropTypes.func,
      value: PropTypes.bool,
    }).isRequired,
    id: PropTypes.string.isRequired,
  };

  const SelectField = ({
    id,
    field: { name, value, onChange, onBlur },
    ...props
  }) => (
    <div>
      <Select
        id={id}
        name={name}
        onChange={onChange}
        value={value}
        onBlur={onBlur}
        {...props}
      >
        <option value="club">Club</option>
        <option value="home">Home</option>
        <option value="studio">Studio</option>
      </Select>
    </div>
  );

  SelectField.propTypes = {
    field: PropTypes.shape({
      name: PropTypes.string,
      onBlur: PropTypes.func,
      onChange: PropTypes.func,
      value: PropTypes.string,
    }).isRequired,
    id: PropTypes.string.isRequired,
  };

  return (
    <StyledDiv>
      <form data-testid="locomotiveAdd-form" onSubmit={handleSubmit}>
        <ul>
          <li>
            {values.thumbnail && (
              <img src={values.thumbnail} width="200" alt="" />
            )}
          </li>
          <li data-testid="road">
            <FormField label="Road">
              <Field id="road" type="text" name="road" placeholder="" />
            </FormField>
            <Error>
              {errors.road && touched.road ? (
                <div className="error">{errors.road}</div>
              ) : null}
            </Error>
          </li>
          <li data-testid="engine_number">
            <FormField label="Engine Number">
              <Field
                id="engine_number"
                type="text"
                name="engine_number"
                placeholder=""
              />
            </FormField>
            <Error>
              {errors.engine_number && touched.engine_number ? (
                <div className="error">{errors.engine_number}</div>
              ) : null}
            </Error>
          </li>
          <li data-testid="purchased_on">
            <FormField label="purchased_on">
              <Field
                id="purchased_on"
                type="date"
                name="purchased_on"
                placeholder=""
              />
            </FormField>
          </li>
          <li data-testid="is_operational">
            <FormField label="Is Operational">
              <Field
                id="is_operational"
                name="is_operational"
                component={SwitchField}
              />
            </FormField>
          </li>
          <li>
            <FormField label="Is DCC">
              <Field id="is_dcc" name="is_dcc" component={SwitchField} />
            </FormField>
          </li>
          <li>
            <FormField label="Location">
              <Field id="location" name="location" component={SelectField} />
            </FormField>
          </li>
          <li>
            <Gallery
              handleSelection={photo => {
                setFieldValue('thumbnail', photo.path);
              }}
              photos={photos}
              title="Select a Photo"
            />
          </li>
          <li>
            <Button
              type="submit"
              data-testid="locomotiveAdd-submit"
              disabled={isSubmitting}
            >
              Submit
            </Button>
          </li>
        </ul>
      </form>
    </StyledDiv>
  );
};

Form.propTypes = {
  errors: PropTypes.shape({
    engine_number: PropTypes.node,
    road: PropTypes.node,
  }),
  handleSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
  photos: PropTypes.arrayOf(PropTypes.object),
  setFieldValue: PropTypes.func,
  touched: PropTypes.shape({
    engine_number: PropTypes.bool,
    road: PropTypes.bool,
  }).isRequired,
  values: PropTypes.shape(PropTypes.object),
};

Form.defaultProps = {
  errors: {},
  isSubmitting: false,
  photos: [],
  setFieldValue: () => {},
  values: {},
};

export default Form;
