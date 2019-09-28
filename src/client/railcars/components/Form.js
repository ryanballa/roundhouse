/* eslint-disable react/no-multi-comp */
import React from 'react';
import { Field } from 'formik';
import PropTypes from 'prop-types';
import Error from '../../components/atoms/forms/Error';
import { styledComponent } from '../../utils/styledComponent';
import { colors } from '../../config/styles';
import Gallery from '../../components/organisms/Gallery';
import Input from '../../components/atoms/forms/Input';
import Select from '../../components/atoms/forms/Select';
import Toggle from '../../components/atoms/forms/Toggle';
import DatePickerField from '../../components/atoms/forms/DatePickerField';
import Button from '../../components/atoms/Button';

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
  return (
    <StyledDiv>
      <form data-testid="locomotiveAdd-form" onSubmit={handleSubmit}>
        <ul>
          <li>
            {values.thumbnail && (
              <img src={values.thumbnail} width="200" alt="" />
            )}
          </li>
          <li>
            <Field type="hidden" name="user_id" />
          </li>
          <li data-testid="road">
            <Input
              label="Road"
              id="road"
              type="text"
              name="road"
              placeholder=""
            />
            <Error>
              {errors.road && touched.road ? (
                <div className="error">{errors.road}</div>
              ) : null}
            </Error>
          </li>
          <li data-testid="length">
            <Input
              label="Length"
              id="length"
              type="text"
              name="length"
              placeholder=""
            />
          </li>
          <li data-testid="color">
            <Input
              label="Color"
              id="color"
              type="text"
              name="color"
              placeholder=""
            />
          </li>
          <li data-testid="reporting_marks">
            <Input
              label="Reporting Marks"
              id="reporting_marks"
              type="text"
              name="reporting_marks"
              placeholder=""
            />
          </li>
          <li data-testid="type">
            <Select
              label="Type"
              id="type"
              type="text"
              name="type"
              placeholder=""
            >
              <option value="arack">Auto Rack</option>
              <option value="box">Boxcar</option>
              <option value="bulk">Bulkhead Flat</option>
              <option value="cmthpr">Cement Hopper</option>
              <option value="coal">Coal Car</option>
              <option value="cvhop">Covered Hopper</option>
              <option value="cntrbm">Centerbeam</option>
              <option value="exp">Express</option>
              <option value="flat">Flat Car</option>
              <option value="gon">Gondola</option>
              <option value="ore">Ore Car</option>
              <option value="other">Other</option>
              <option value="pass">Passenger Car</option>
              <option value="ref">Reefer</option>
              <option value="tnk">Tank Car</option>
            </Select>
          </li>
          <li data-testid="car_number">
            <Input
              label="Car Number"
              id="car_number"
              type="text"
              name="car_number"
              placeholder=""
            />
            <Error>
              {errors.car_number && touched.car_number ? (
                <div className="error">{errors.car_number}</div>
              ) : null}
            </Error>
          </li>
          <li data-testid="purchased_on">
            <DatePickerField
              label="Purchased On"
              name="purchased_on"
              setFieldValue={setFieldValue}
              values={values || []}
            />
          </li>
          <li data-testid="is_operational">
            <Field
              label="Operational"
              id="is_operational"
              name="is_operational"
              component={Toggle}
              setFieldValue={setFieldValue}
            />
          </li>
          <li>
            <Select label="Location" id="location" name="location">
              <option value="club">Club</option>
              <option value="home">Home</option>
              <option value="studio">Studio</option>
            </Select>
          </li>
          <li>
            <Input
              label="Value"
              id="value"
              type="text"
              name="value"
              placeholder="0"
            />
          </li>
          <li>
            <Input
              label="Purchase Price"
              id="purchase_price"
              type="text"
              name="purchase_price"
              placeholder="0"
            />
          </li>
          <li>
            <Input
              label="Notes"
              id="notes"
              type="text"
              name="notes"
              placeholder=""
            />
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
            <Button data-testid="locomotiveAdd-submit" disabled={isSubmitting}>
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
    car_number: PropTypes.node,
    road: PropTypes.node,
  }),
  handleSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
  photos: PropTypes.arrayOf(PropTypes.object),
  setFieldValue: PropTypes.func,
  touched: PropTypes.shape({
    car_number: PropTypes.bool,
    road: PropTypes.bool,
  }).isRequired,
  values: PropTypes.shape({
    required: PropTypes.bool,
    thumbnail: PropTypes.string,
  }),
};

Form.defaultProps = {
  errors: {},
  isSubmitting: false,
  photos: [],
  setFieldValue: () => {},
  values: {},
};

export default Form;
